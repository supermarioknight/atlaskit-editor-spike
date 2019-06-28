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

const Root = styled.div`
  display: flex;
  padding: ${gridSize() * 3}px;
  max-width: 700px;

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
  overflow: hidden;

  .akEditor ~ div {
    display: none;
  }

  :after {
    content: "";
    position: absolute;
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
  transition: opacity 200ms;

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
  transition: opacity 200ms;
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
            >
              Reply to customer
            </Button>
          )}
        </Move>
      </Motion>
    </>
  );

  return (
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
                            <React.Suspense fallback={<EditorHeightSpacing />}>
                              <LazyEditor appearance="comment" />
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
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
