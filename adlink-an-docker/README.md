## How to use
### Create workspace folder `adlink`
```
mkdir adlink
```

### Go to workspace
```
cd adlink
```

### Clone all repos 
```
git clone git@gitlab.com:adlink-network/platform-api.git
git clone git@gitlab.com:adlink-network/platform.git
```

### Go to docker repo
```
cd /adlink-an-docker
```

### Create `my-php-nginx:8.2` image (nginx & php 8.2)
```
docker build -f php-nginx-8-2/Dockerfile -t my-php-nginx:8.2 .
```

### Create `my-node:18` image (node 18)                                                                              
```
docker build -f node-18/Dockerfile -t my-node:18 .
```

### `Build container`
```
docker-compose --profile backend --profile frontend --profile sdk up -d

//Note: Nếu trùng port thì xoá sạch container
```

#### 1. Only Backend
```
docker-compose --profile backend up -d
```

#### 2. Only Frontend
```
docker-compose --profile frontend up -d
```

#### 3. Only SDK
```
docker-compose --profile sdk up -d
```

---
### `Stop container`
```
docker-compose --profile backend --profile frontend --profile sdk stop
```

#### 1. Only Backend
```
docker-compose --profile backend stop
```

#### 2. Only Frontend
```
docker-compose --profile frontend stop
```

#### 3. Only SDK
```
docker-compose --profile sdk stop
```

---
### `Restart container` 
```
docker-compose --profile backend --profile frontend --profile sdk start
```

#### 1. Only Backend
```
docker-compose --profile backend start
```

#### 2. Only Frontend
```
docker-compose --profile frontend start
```

#### 3. Only SDK
```
docker-compose --profile sdk start
```