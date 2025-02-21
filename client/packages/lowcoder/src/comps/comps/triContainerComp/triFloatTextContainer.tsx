import {
  TextContainerStyleType,
  ContainerStyleType,
  heightCalculator,
  widthCalculator,
  AnimationStyleType,
} from "comps/controls/styleControlConstants";
import { EditorContext } from "comps/editorState";
import { BackgroundColorContext } from "comps/utils/backgroundColorContext";
import { HintPlaceHolder, ScrollBar, TacoMarkDown } from "lowcoder-design";
import { ReactNode, useContext } from "react";
import styled, { css } from "styled-components";
import { checkIsMobile } from "util/commonUtils";
import {
  gridItemCompToGridItems,
  InnerGrid,
} from "../containerComp/containerView";
import { TriContainerViewProps } from "../triContainerComp/triContainerCompBuilder";
import { getBackgroundStyle } from "@lowcoder-ee/util/styleUtils";

const getStyle = (style: TextContainerStyleType) => {
  return css`
    border-radius: ${(style.radius ? style.radius : "4px")};
    border: ${(style.borderWidth ? style.borderWidth : "0px")} ${(style.borderStyle ? style.borderStyle : "solid")} ${style.border};
    color: ${style.text};
    font-size: ${style.textSize} !important;
    font-weight: ${style.textWeight} !important;
    font-family: ${style.fontFamily} !important;
    font-style:${style.fontStyle} !important;
    text-transform:${style.textTransform} !important;
    text-decoration:${style.textDecoration} !important;
    ${getBackgroundStyle(style)}

    .markdown-body a {
      color: ${style.links};
    }
    .markdown-body {
      margin: ${style.margin} !important;	
      padding: ${style.padding};	
      width: ${widthCalculator(style.margin)};	
      // height: ${heightCalculator(style.margin)};
      h1 {
        line-height: 1.5;
      }
      h5 {
        line-height: 2.2;
      }
    }

    .markdown-body {
      &,
      p,
      div,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: ${style.text};
      }
      img,
      pre {
        background-color: ${style.background};
        code {
          color: #000000;
        }
      }
      background-color: transparent;
    }
  `;
  }

const Wrapper = styled.div<{
  $style: ContainerStyleType;
  $animationStyle?: AnimationStyleType;
}>`
${props=>props.$animationStyle&&props.$animationStyle}
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow-y: scroll;
  border: ${(props) => props.$style.borderWidth} ${(props) => (props.$style.borderStyle ? props.$style.borderStyle : "solid")} ${(props) => props.$style.border};
  border-radius: ${(props) => props.$style.radius};
  padding: ${(props) => props.$style.padding};
  margin: ${(props) => props.$style.margin};
  ${props => getBackgroundStyle(props.$style)}
`;

const FloatTextWrapper = styled.div<{ $style: TextContainerStyleType, $horizontalAlignment : any }>`
  ${(props) => props.$style && getStyle(props.$style)}
  text-align: ${(props) => props.$horizontalAlignment};
  padding: ${(props) => props.$style.padding};
  margin: ${(props) => props.$style.margin};
`;

const HeaderInnerGrid = styled(InnerGrid)<{
  $backgroundColor: string,
  $headerBackgroundImage: string,
  $headerBackgroundImageSize: string,
  $headerBackgroundImageRepeat: string,
  $headerBackgroundImageOrigin: string,
  $headerBackgroundImagePosition: string,
 }>`
  overflow: visible;
  border-radius: 0;
  ${props => getBackgroundStyle({
    background: props.$backgroundColor,
    backgroundImage: props.$headerBackgroundImage,
    backgroundImageSize: props.$headerBackgroundImageSize,
    backgroundImageRepeat: props.$headerBackgroundImageRepeat,
    backgroundImageOrigin: props.$headerBackgroundImageOrigin,
    backgroundImagePosition: props.$headerBackgroundImagePosition,
  })}
`;

const BodyInnerGrid = styled(InnerGrid)<{
  $showBorder: boolean;
  $borderColor: string;
  $borderWidth: string;
  $backgroundColor: string;
  $bodyBackgroundImage: string;
  $bodyBackgroundImageRepeat: string;
  $bodyBackgroundImageSize: string;
  $bodyBackgroundImagePosition: string;
  $bodyBackgroundImageOrigin: string;
}>`
  border-top: ${(props) => `${props.$showBorder ? props.$borderWidth : 0} solid ${props.$borderColor}`};
  flex: 1;
  border-radius: 0;
  ${props => getBackgroundStyle({
    background: props.$backgroundColor,
    backgroundImage: props.$bodyBackgroundImage,
    backgroundImageSize: props.$bodyBackgroundImageSize,
    backgroundImageRepeat: props.$bodyBackgroundImageRepeat,
    backgroundImageOrigin: props.$bodyBackgroundImageOrigin,
    backgroundImagePosition: props.$bodyBackgroundImagePosition,
  })}
`;

const FooterInnerGrid = styled(InnerGrid)<{
  $showBorder: boolean;
  $backgroundColor: string;
  $borderColor: string;
  $borderWidth: string;
  $footerBackgroundImage: string;
  $footerBackgroundImageRepeat: string;
  $footerBackgroundImageSize: string;
  $footerBackgroundImagePosition: string;
  $footerBackgroundImageOrigin: string;
}>`
  border-top: ${(props) => `${props.$showBorder ? props.$borderWidth : 0} solid ${props.$borderColor}`};
  overflow: visible;
  ${(props) => props.$backgroundColor && `background-color: ${props.$backgroundColor};`}
  border-radius: 0;
  ${props => getBackgroundStyle({
    background: props.$backgroundColor,
    backgroundImage: props.$footerBackgroundImage,
    backgroundImageSize: props.$footerBackgroundImageSize,
    backgroundImageRepeat: props.$footerBackgroundImageRepeat,
    backgroundImageOrigin: props.$footerBackgroundImageOrigin,
    backgroundImagePosition: props.$footerBackgroundImagePosition,
  })}
`;

export type TriContainerProps = TriContainerViewProps & {
  hintPlaceholder?: ReactNode;
  text: {
    value: string;
  };
  type: string;
  float: string;
  width: string;
  style: TextContainerStyleType;
  horizontalAlignment: string;
  animationStyle?: AnimationStyleType;
};

export function TriContainer(props: TriContainerProps) {
  const {container, text, animationStyle} = props;
  const { showHeader, showFooter, horizontalGridCells } = container;
  // When the header and footer are not displayed, the body must be displayed
  const showBody = container.showBody || (!showHeader && !showFooter);

  const { items: headerItems, ...otherHeaderProps } = container.header;
  const { items: bodyItems, ...otherBodyProps } =
    container.body["0"].children.view.getView();
  const { items: footerItems, ...otherFooterProps } = container.footer;

  const editorState = useContext(EditorContext);
  const maxWidth = editorState.getAppSettings().maxWidth;
  const isMobile = checkIsMobile(maxWidth);
  const paddingWidth = isMobile ? 7 : 19;

  const {
    style,
    headerStyle,
    bodyStyle,
    footerStyle,
  } = container; 

  return (
    <Wrapper $style={style} $animationStyle={animationStyle}>
      {showHeader && (
        <BackgroundColorContext.Provider
          value={container.style.background}
        >
          <HeaderInnerGrid
            {...otherHeaderProps}
            horizontalGridCells={horizontalGridCells}
            items={gridItemCompToGridItems(headerItems)}
            autoHeight={true}
            emptyRows={5}
            minHeight="46px"
            containerPadding={[0, 0]}
            showName={{ bottom: showFooter ? 20 : 0 }}
            $backgroundColor={headerStyle?.headerBackground || 'transparent'}
            $headerBackgroundImage={headerStyle?.headerBackgroundImage}
            $headerBackgroundImageRepeat={headerStyle?.headerBackgroundImageRepeat}
            $headerBackgroundImageSize={headerStyle?.headerBackgroundImageSize}
            $headerBackgroundImagePosition={headerStyle?.headerBackgroundImagePosition}
            $headerBackgroundImageOrigin={headerStyle?.headerBackgroundImageOrigin}
            style={{ padding: headerStyle.containerHeaderPadding}} />
        </BackgroundColorContext.Provider>
      )}
      {showBody && (
        <BackgroundColorContext.Provider value={container.style.background}>
          <ScrollBar style={{ height: container.autoHeight ? "auto" : "100%", margin: "0px", padding: "0px" }} hideScrollbar={!container.showVerticalScrollbar}>
            <div style={{ background: `${container.style.background}` }}>
              <BodyInnerGrid
                $showBorder={false}
                {...otherBodyProps}
                horizontalGridCells={horizontalGridCells}
                items={gridItemCompToGridItems(bodyItems)}
                autoHeight={container.autoHeight}
                emptyRows={14}
                minHeight={showHeader ? "143px" : "142px"}
                containerPadding={[0, 0]}
                hintPlaceholder={props.hintPlaceholder ?? HintPlaceHolder}
                $backgroundColor={bodyStyle?.background || 'transparent'}
                $bodyBackgroundImage={bodyStyle?.backgroundImage}
                $bodyBackgroundImageRepeat={bodyStyle?.backgroundImageRepeat}
                $bodyBackgroundImageSize={bodyStyle?.backgroundImageSize}
                $bodyBackgroundImagePosition={bodyStyle?.backgroundImagePosition}
                $bodyBackgroundImageOrigin={bodyStyle?.backgroundImageOrigin}
                $borderColor={style?.border}
                $borderWidth={style?.borderWidth}
                style={{
                  float: `${props.float}`,
                  width: `${props.float === "none" ? "100%" : `${props.width}%`}`,
                  height: "100%",
                  ...container.bodyStyle
                }}
                />
              <FloatTextWrapper
                $style={props.style}
                $horizontalAlignment={props.horizontalAlignment}
              >
                <p>
                  {props.type === "markdown" ? (
                    <TacoMarkDown>{text.value}</TacoMarkDown>
                  ) : (
                    text.value
                  )}
                </p>
              </FloatTextWrapper>
            </div>
          </ScrollBar>
        </BackgroundColorContext.Provider>
      )}
      {showFooter && (
        <BackgroundColorContext.Provider
          value={container.style.background}
        >
          <FooterInnerGrid
            $showBorder={showHeader}
            {...otherFooterProps}
            horizontalGridCells={horizontalGridCells}
            items={gridItemCompToGridItems(footerItems)}
            autoHeight={true}
            emptyRows={5}
            minHeight={"48px"}
            containerPadding={[0, 0]}
            showName={{ top: showHeader ? 20 : 0 }}
            $backgroundColor={footerStyle?.footerBackground || 'transparent'}
            $footerBackgroundImage={footerStyle?.footerBackgroundImage}
            $footerBackgroundImageRepeat={footerStyle?.footerBackgroundImageRepeat}
            $footerBackgroundImageSize={footerStyle?.footerBackgroundImageSize}
            $footerBackgroundImagePosition={footerStyle?.footerBackgroundImagePosition}
            $footerBackgroundImageOrigin={footerStyle?.footerBackgroundImageOrigin}
            $borderColor={style?.border}
            $borderWidth={style?.borderWidth}
            style={{ padding: footerStyle.containerFooterPadding }} />
        </BackgroundColorContext.Provider>
      )}
    </Wrapper>
  );
}
