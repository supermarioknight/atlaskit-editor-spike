import "@atlaskit/css-reset";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Button from "@atlaskit/button";
import Avatar from "@atlaskit/avatar";
import AttachmentIcon from "@atlaskit/icon/glyph/attachment";
import { colors, gridSize, borderRadius } from "@atlaskit/theme";
import Motion, { Scale, InverseScale } from "@element-motion/core";

const LazyEditor = React.lazy(() =>
  import("@atlaskit/editor-core").then(modu => ({ default: modu.Editor }))
);

const Root = styled.div`
  display: flex;
  padding: ${gridSize() * 3}px;

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
  min-height: 150px;
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

  > * {
    margin-right: 4px;
  }
`;

const ExpandedContainer = styled.div``;

const RootContainer = styled.div`
  width: 100%;
`;

const InnerContainer = styled.div`
  width: 100%;
`;

function App() {
  const [state, setCommentState] = React.useState("collapsed");
  const isCollapsed = state === "collapsed";

  const buttons = (
    <>
      <Button
        spacing={isCollapsed ? "none" : "default"}
        appearance="link"
        onClick={() => setCommentState("internal")}
      >
        Add internal note
      </Button>
      {isCollapsed && <Delimeter />}
      <Button
        spacing={isCollapsed ? "none" : "default"}
        appearance="link"
        onClick={() => setCommentState("customer")}
      >
        Reply to customer
      </Button>
    </>
  );

  return (
    <Root>
      <Avatar />

      {isCollapsed && (
        <Motion name="editor-box">
          <Scale>
            {({ ref, ...motion }) => (
              <CollapsedContainer innerRef={ref} {...motion}>
                <InverseScale>
                  {inverse => (
                    <InnerContainer {...inverse}>
                      {buttons}
                      <IconContainer>
                        <AttachmentIcon primaryColor={colors.N100} />
                      </IconContainer>
                    </InnerContainer>
                  )}
                </InverseScale>
              </CollapsedContainer>
            )}
          </Scale>
        </Motion>
      )}

      {!isCollapsed && (
        <RootContainer>
          <ExpandedContainer>{buttons}</ExpandedContainer>

          <Motion name="editor-box">
            <Scale>
              {({ ref, ...motion }) => (
                <EditorContainer innerRef={ref} {...motion}>
                  <InverseScale>
                    {inverse => (
                      <InnerContainer {...inverse}>
                        <React.Suspense fallback={null}>
                          <LazyEditor appearance="comment" />
                        </React.Suspense>
                      </InnerContainer>
                    )}
                  </InverseScale>
                </EditorContainer>
              )}
            </Scale>
          </Motion>

          <ButtonGroup>
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
        </RootContainer>
      )}
    </Root>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
