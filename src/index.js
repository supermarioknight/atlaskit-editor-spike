import "@atlaskit/css-reset";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Button from "@atlaskit/button";
import Avatar from "@atlaskit/avatar";
import AttachmentIcon from "@atlaskit/icon/glyph/attachment";
import { colors, gridSize, borderRadius } from "@atlaskit/theme";
import Motion, { Reveal, Move, VisibilityManager } from "@element-motion/core";
import { Editor as LazyEditor } from "@atlaskit/editor-core";
import image from "./bg.png";

const Root = styled.div`
  display: flex;
  padding: ${gridSize() * 3}px;
  position: absolute;
  top: 268px;
  left: 381px;
  width: 806px;
  background-color: white;

  > :first-child {
    margin-right: ${gridSize()}px;
  }
`;

const CollapsedContainer = styled.div`
  white-space: nowrap;
  border: 1px solid ${colors.N40};
  box-sizing: border-box;
  padding: ${gridSize()}px ${gridSize() * 1.5}px;
  border-radius: ${borderRadius()}px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;

  > div {
    display: flex;
  }
`;

const Delimeter = styled.span`
  display: inline-block;
  padding: 0 ${borderRadius() * 2}px;
  color: ${colors.N100};

  :before {
    content: "/";
  }
`;

const EditorContainer = styled.div`
  width: 100%;
  position: relative;

  .akEditor ~ div {
    display: none;
  }

  :after {
    content: "";
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border: 1px solid ${colors.N40};
    border-radius: ${borderRadius()}px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const ButtonGroup = styled.div`
  margin-top: ${gridSize() * 2}px;
  transition: opacity 150ms;

  > * {
    margin-right: 4px;
  }
`;

const ExpandedContainer = styled.div`
  padding: ${gridSize()}px;

  > * {
    margin-right: ${gridSize() * 4}px;
  }
`;

const RootContainer = styled.div`
  width: 100%;
`;

const EditorHeightSpacing = styled.div`
  min-height: 150px;
`;

const AbsoluteButtons = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  left: 80px;
  top: 34px;
`;

const Fade = styled.div`
  transition: opacity 150ms;
`;

const Product = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 1625px;
  height: 865px;
  background-size: cover;
  background-image: url(${image});
`;

const visibilityToOpacity = obj => {
  const { visibility, style } = obj.style;

  return {
    style: {
      ...style,
      opacity: visibility === "visible" ? 1 : 0
    }
  };
};

function App() {
  const [state, setCommentState] = React.useState("collapsed");
  const isCollapsed = state === "collapsed";
  const isInternal = state === "internal";
  const isCustomer = state === "customer";

  const buttons = (
    <>
      <Motion name="internal">
        <Move scaleX={false} scaleY={false}>
          {motion => (
            <Button
              spacing={"none"}
              appearance="link"
              onClick={() => setCommentState("internal")}
              ref={motion.ref}
              style={motion.style}
              theme={(curr, theme) => {
                const { buttonStyles, ...rest } = curr(theme);

                return {
                  buttonStyles: {
                    ...buttonStyles,
                    color: isInternal ? `#172b4d` : buttonStyles.color,
                    fontWeight: isInternal ? 500 : buttonStyles.fontWeight
                  },
                  ...rest
                };
              }}
            >
              Add internal note
            </Button>
          )}
        </Move>
      </Motion>

      {isCollapsed && <Delimeter />}

      <Motion name="customer">
        <Move scaleX={false} scaleY={false}>
          {motion => (
            <Button
              spacing={"none"}
              appearance="link"
              onClick={() => setCommentState("customer")}
              ref={motion.ref}
              style={motion.style}
              theme={(curr, theme) => {
                const { buttonStyles, ...rest } = curr(theme);

                return {
                  buttonStyles: {
                    ...buttonStyles,
                    color: isCustomer ? `#172b4d` : buttonStyles.color,
                    fontWeight: isCustomer ? 500 : buttonStyles.fontWeight
                  },
                  ...rest
                };
              }}
            >
              Reply to customer
            </Button>
          )}
        </Move>
      </Motion>
    </>
  );

  return (
    <>
      <Product />

      <Root>
        <Avatar />

        {isCollapsed && <AbsoluteButtons>{buttons}</AbsoluteButtons>}

        {isCollapsed && (
          <Motion name="editor-box">
            <Move scaleX={false} scaleY={false} zIndex={1}>
              <Reveal useClipPath={false}>
                {({ ref, ...motion }) => (
                  <CollapsedContainer innerRef={ref} {...motion}>
                    <IconContainer>
                      <AttachmentIcon primaryColor={colors.N100} />
                    </IconContainer>
                  </CollapsedContainer>
                )}
              </Reveal>
            </Move>
          </Motion>
        )}

        {!isCollapsed && (
          <RootContainer>
            <ExpandedContainer>{buttons}</ExpandedContainer>

            <VisibilityManager>
              {visibility => (
                <>
                  <Motion name="editor-box">
                    <Move scaleX={false} scaleY={false} zIndex={1}>
                      <Reveal useClipPath={false}>
                        {({ ref, ...motion }) => (
                          <EditorContainer innerRef={ref} {...motion}>
                            <Fade {...visibilityToOpacity(visibility)}>
                              <React.Suspense
                                fallback={<EditorHeightSpacing />}
                              >
                                <LazyEditor shouldFocus appearance="comment" />
                              </React.Suspense>
                            </Fade>
                          </EditorContainer>
                        )}
                      </Reveal>
                    </Move>
                  </Motion>

                  <ButtonGroup {...visibilityToOpacity(visibility)}>
                    <Button
                      appearance="primary"
                      onClick={() => setCommentState("collapsed")}
                    >
                      Submit
                    </Button>
                    <Button
                      appearance="subtle-link"
                      onClick={() => setCommentState("collapsed")}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </>
              )}
            </VisibilityManager>
          </RootContainer>
        )}
      </Root>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
