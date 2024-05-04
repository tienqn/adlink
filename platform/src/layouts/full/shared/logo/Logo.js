import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoDark } from 'src/assets/images/logos/dark-logo.svg';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/dark-rtl-logo.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/light-logo.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/light-logo-rtl.svg';
import {Box, styled} from '@mui/material';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '220px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent:"center",
    alignItems: 'center',

    // borderBottom:"1px solid #d4d4d4",
    // marginBottom:"16px"

  }));

  const LogoCustom = styled(Box)(() => ({
    fontWeight:600,
    fontSize: "24px",
    whiteSpace: 'nowrap',
    color:"black"
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled to="/" style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        {customizer.activeMode === 'dark' ? (
          // <LogoLight />
            <LogoCustom>AdLink Network</LogoCustom>
        ) : (
          // <LogoDark />
            <LogoCustom>AdLink Network</LogoCustom>
        )}
      </LinkStyled>
    );
  }
  return (
    <LinkStyled to="/" style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      {customizer.activeMode === 'dark' ? (
        // <LogoDarkRTL />
          <LogoCustom>AdLink Network</LogoCustom>
      ) : (
        // <LogoLightRTL />
          <LogoCustom>AdLink Network</LogoCustom>
      )}
    </LinkStyled>
  );
};

export default Logo;
