class AdLinkDeliveryClass {
    async getTags() {
        if (this.isEmpty(window.adsbyadlink)) {
            console.error("Invalid tags.");
            return;
        }

        console.log('this._tags', window.adsbyadlink);
        await this.wait(100);
        console.log('Object.keys(this._tags)', Object.keys(window.adsbyadlink));
        console.log('Object.values(this._tags)', Object.values(window.adsbyadlink));

        window.adsbyadlink.forEach(async (tag) => {
            const creatives = await this.getCreatives(tag.adunit, tag.sizes) || null;
            if (this.isEmpty(creatives)) {
                return;
            }

            let wrapperId = `adsbyadlink-${tag.adunit}`;
            if (tag.creative) {
                wrapperId += `-${tag.creative}`;
            }
            this.processTag(wrapperId, creatives, tag);
        });
        return 'done';
    }

    async getTag(tag) {
        console.log('tag_v2', tag);
        const creatives = await this.getCreatives(tag.adunit, tag.sizes) || null;
        if (this.isEmpty(creatives)) {
            return;
        }

        let wrapperId = `adsbyadlink-${tag.adunit}`;
        if (tag.creative) {
            wrapperId += `-${tag.creative}`;
        }
        this.processTag(wrapperId, creatives, tag);
    }

    processTag(id, creatives, tag) {
        const wrapper = document.getElementById(id);
        if (!wrapper) {
            console.warn(`wrapper ${id} is not exist`);
            return;
        }
        if (wrapper.childNodes.length) {
            console.warn(`wrapper ${id} is not empty`);
            return;
        }

        const minMaxSize = this.minMaxSize(tag.sizes);
        wrapper.style.minHeight = minMaxSize.maxHeight + 'px';
        wrapper.style.minWidth = minMaxSize.maxWidth + 'px';

        try {
            const creative = this.getCreative(creatives, tag.creative ?? null);

            const isOutOfPage = creative?.size === "1x1";

            if (!creative || !creative.html) {
                this.hideTag(wrapper);
                return;
            }

            if (isOutOfPage) {
                this.noSafeFrameWithContent(wrapper, creative.html)
            } else {
                let iframeId = `adsbyadlink_iframe_${id}`;

                const iframe = this.createIframe(wrapper, iframeId);
                this.iframeWithContent(iframe, creative.htmlFrame);
                iframe.dataset.loadComplete = "true";

                if (creative.width) {
                    iframe.style.width = `${creative.width}px`;
                }

                iframe.onload = function() {
                    const contentHeight = this.contentWindow.document.body.offsetHeight || this.contentWindow.document.body.clientHeight;
                    if (contentHeight && creative.height) {
                        this.style.height = `${(contentHeight >= creative.height) ? creative.height : contentHeight}px`;
                    } else {
                        AdLinkDelivery.hideTag(wrapper);
                    }
                };
            }
        } catch (error) {
            console.error("An error occurred:", error);
            this.hideTag(wrapper);
        }
    }

    wait(milliseconds) { 
        new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    isEmpty(obj) {
        return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
    }

    noSafeFrameWithContent(wrapper, content) {
        wrapper.innerHTML = content;

        wrapper.querySelectorAll("script").forEach(script => {
            const clone = document.createElement("script");

            for (const attr of script.attributes) {
                clone.setAttribute(attr.name, attr.value);
            }
            clone.setAttribute('data-cloned', 'done');
            clone.text = script.innerHTML;
            script.parentNode?.replaceChild(clone, script);
        });
    }

    isIFrame() {
        return window !== window.top;
    }

    getSiteUrl() {
        return this.isIFrame() ? window.top.location.href : window.location.href;
    }

    getSiteInfo() {
        return window.adlinksite;
    }

    minMaxSize(sizes) {
        let minWidth = 1, maxWidth = 1, minHeight = 1, maxHeight = 1;
        for ( const size of sizes ) {
            if (size[0] > maxWidth) {
                maxWidth = size[0];
            }

            if (size[0] < minWidth) {
                minWidth = size[0];
            }

            if (size[1] > maxHeight) {
                maxHeight = size[1];
            }

            if (size[1] < minHeight) {
                minHeight = size[1];
            }
        }

        return {
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
        }
    }

    createIframe(wrapper, iframeId) {
        let iframe = document.createElement("iframe");
        iframe.src = "about:blank";
        iframe.id = iframeId;
        iframe.marginHeight = "0";
        iframe.marginWidth = "0";
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.dataset.loadComplete = "false";
        wrapper && wrapper.appendChild(iframe);

        return document.getElementById(iframeId);
    }

    getIframeDoc(iframe) {
        return iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow ? iframe.contentWindow.document : iframe.document ? iframe.document : null;
    }

    writeContentToIframe(iframe, content) {
        const iframeDoc = this.getIframeDoc(iframe);
        iframeDoc && (iframeDoc.open(), iframeDoc.write(content), iframeDoc.close());
    }

    iframeWithContent(iframe, content) {
        return this.writeContentToIframe(iframe, content);
    }

    listSizesToString(sizes) {
        let a = [];
        for (const size of sizes) {
            a.push(size[0] + "x" + size[1]);
        }
        return a.join(",");
    }

    hideTag(wrapper) {
        wrapper.style.display = "none";
    }

    async cacheCreatives(adUnitCode, sizes) {
        const localStorageKey = `adlink_${adUnitCode}`;

        if (this.getSiteInfo().clearStorage) {
            localStorage.removeItem(localStorageKey);
        }

        const cacheData = localStorage.getItem(localStorageKey);

        const {expireIn, data} = JSON.parse(cacheData) || {};

        // check expire TTL
        let isReturnCache = false;
        if (expireIn) {
            const currentDate = new Date()
            const currentDate_UTC = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds());
            const expiredDate = new Date(expireIn);
            const expiredDate_UTC = Date.UTC(expiredDate.getUTCFullYear(), expiredDate.getUTCMonth(), expiredDate.getUTCDate(), expiredDate.getUTCHours(), expiredDate.getUTCMinutes(), expiredDate.getUTCSeconds());
            isReturnCache = !!(data && expiredDate_UTC > currentDate_UTC);
        }

        if(isReturnCache) {
            return data;
        } 
        
        const jsonData = await this.serviceResponse(adUnitCode, sizes);


        const now = new Date(Date.now() + (5 * 60 * 1000));
        const utcDate = now.toUTCString();

        localStorage.setItem(localStorageKey, JSON.stringify({
            expireIn: utcDate,
            data: jsonData
        }));
        return jsonData;
    }

    async serviceResponse(adUnitCode, sizes) {
        try {
            // let serviceUrl = `${this.getSiteInfo().serviceUrl}/${adUnitCode}.json?sizes=${this.listSizesToString(sizes)}`;
            let serviceUrl = `${this.getSiteInfo().serviceUrl}/${adUnitCode}.json`;
            const response = await fetch(serviceUrl);
            return await response.json();
        } catch ( error ) {
            console.error("An error occurred in getCreatives:", error);
            return null;
        }
    }

    async getCreatives(adUnitCode, sizes) {
        const useStorage = this.getSiteInfo().useStorage || true;
        if (useStorage) {
            return await this.cacheCreatives(adUnitCode, sizes);
        }
        return await this.serviceResponse(adUnitCode, sizes);
    }

    getCreative(creatives, key) {
        if ( !creatives || (creatives.length < 1) ) return null;
        let index = 0;
        if ( key ) {
            const creativeKeys = Object.keys(creatives);
            index = creativeKeys.indexOf(key);
            index = index + 1;
            if ( index >= creativeKeys.length ) {
                index = -1;
            }
        }

        return index > -1 ? Object.values(creatives)[index] : null;
    }
}


const AdLinkDelivery = new AdLinkDeliveryClass();
