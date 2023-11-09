State.init({
  prompt,
  promptLoading: false,
  cssStyle,
  htmlElement,
  widgetName,
  name: "",
  description: "",
  website: "",
  image: {
    ipfs_cid: "",
  },
  clicked: false,
  export: false,
  img: null,
  tags,
  choose,
  htmlDocs,
});
const promptLoadingUI = (
  <span
    className="spinner-grow spinner-grow-sm me-1"
    role="status"
    aria-hidden="true"
  />
);
const cPrompt = (e) => {
  State.update({ prompt: e.target.value });
};

const getPrompt = () => {
  State.update({ promptLoading: true });
  console.log("prompt", state.prompt);
  asyncFetch("https://api.openai.com/v1/chat/completions", {
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "Act as a UI developer, users will fill out a prompt about their frontend ideas, and your role is to create a css style of the Button. Create button effects, button font size 30. User prompt:{" +
            state.prompt +
            "}. Give me the JSON for an object : {HTML:`Code`, CSS: `Code`} and no more explaination",
        },
      ],
      max_tokens: 1000,
      temperature: 1,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    method: "POST",
  }).then((res) => {
    if (
      res.body.choices[0].message.content &&
      JSON.parse(res.body.choices[0].message.content)
    ) {
      const dataHtml = JSON.parse(res.body.choices[0].message.content);
      console.log("ai", dataHtml);
      const htmlElement =
        "const Wrapper = styled.div`" +
        dataHtml.CSS +
        "` \nreturn \n<Wrapper>\n" +
        dataHtml.HTML +
        "\n</Wrapper>";
      State.update({ htmlElement: htmlElement });
      State.update({
        cssStyle: dataHtml.CSS.replaceAll("\n", "").replaceAll("\n", ""),
      });
      const htmlDocs =
        "<style>" + dataHtml.CSS.replaceAll("\n", "") + "</style>";
      htmlDocs += dataHtml.HTML;
      console.log(htmlDocs);
      State.update({ htmlDocs: htmlDocs });
    }

    State.update({ promptLoading: false });
  });
};

const onInputChangeWidgetName = ({ target }) => {
  State.update({ widgetName: target.value });
  State.update({ clicked: false });
  State.update({ export: false });
};
const onInputChangeWidgetTitle = ({ target }) => {
  State.update({ name: target.value });
};
const onInputChangeWidgetDescription = ({ target }) => {
  State.update({ description: target.value });
};
const onInputChangeWidgetWebsite = ({ target }) => {
  State.update({ website: target.value });
};
const uploadFileUpdateState = (body) => {
  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  }).then((res) => {
    const cid = res.body.cid;
    State.update({ image: { ipfs_cid: cid } });
    State.update({ img: { cid } });
  });
};

const filesOnChange = (files) => {
  if (files) {
    State.update({ img: { uploading: true, cid: null } });
    uploadFileUpdateState(files[0]);
  }
};
const taggedWidgets = Social.keys(`*/widget/*/metadata/tags/*`, "final");
let tags = [];
if (Object.keys(taggedWidgets)) {
  Object.keys(taggedWidgets).forEach((item) => {
    if (taggedWidgets[item].widget) {
      if (Object.keys(taggedWidgets[item].widget).length > 0) {
        Object.keys(taggedWidgets[item].widget).forEach((item1) => {
          if (taggedWidgets[item].widget[item1].metadata.tags) {
            if (
              Object.keys(taggedWidgets[item].widget[item1].metadata.tags)
                .length > 0
            ) {
              Object.keys(
                taggedWidgets[item].widget[item1].metadata.tags
              ).forEach((tag) => {
                tags.push(tag);
              });
            }
          }
        });
      }
    }
  });
}

State.update({ tags: tags });
const openModal = () => {
  State.update({ clicked: false });
  State.update({ export: false });
};

const exportForm = () => {
  if (!state.clicked) {
    State.update({ clicked: true });

    const exportListData = Social.get(
      `${context.accountId}/magicbuild/widgetList`
    );

    const exporttList = JSON.parse(exportListData) || [];

    const isExist = false;
    exporttList.forEach((item, index) => {
      if (item.widgetName == state.widgetName) {
        exporttList[index].widgetName = state.widgetName;
        isExist = true;
      }
    });
    if (!isExist) {
      exporttList.push({ widgetName: state.widgetName });
    }

    const data = {
      widget: {
        [state.widgetName]: {
          "": state.htmlElement,
          metadata: {
            name: state.name,
            description: state.description,
            linktree: {
              website: state.website,
            },
            image: {
              ipfs_cid: state.img.cid,
            },
            tags: tagsObj,
          },
        },
      },
      magicbuild: { widgetList: exporttList },
    };
    Social.set(data, {
      force: true,
      onCommit: () => {
        State.update({ export: true });
      },
      onCancel: () => {
        State.update({ clicked: false });
      },
    });
  }
};
const cHTML = (e) => {
  State.update({ htmlElement: e.target.value });
};
const HtmlPreview = styled.div`
 ${props.cssStyle}
`;

return (
  <>
    <div class="row mb-3">
      <div class="form-group col-md-9">
        <h6 class="mb-2">Type your prompt : </h6>
        <input
          class="form-control"
          value={state.prompt}
          placeholder="I want to create a modern style Christmas vibe frontend with gradient background"
          onChange={(e) => cPrompt(e)}
        />
      </div>
      <div class="form-group col-md-3 ">
        <label></label>
        <button
          disabled={state.promptLoading}
          onClick={getPrompt}
          class="btn btn-success form-control "
        >
          {state.promptLoading ? promptLoadingUI : "🪄"} AI Generator
        </button>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-md-3"></div>
      <div class="form-group col-md-3"></div>
      <div class="form-group col-md-3"></div>
      <div class="form-group col-md-3">
        <button
          data-bs-toggle="modal"
          data-bs-target={`#export-${Date.now()}`}
          class="btn btn-primary form-control "
          onClick={openModal}
        >
          🔼Export
        </button>
        <div
          class="modal fade"
          id={`export-${Date.now()}`}
          tabindex="-2"
          aria-labelledby="exportLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exportLabel">
                  Export Widget
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                {state.export && state.widgetName ? (
                  <>
                    <div class="alert alert-primary" role="alert">
                      <a
                        href={`https://near.social/${context.accountId}/widget/${state.widgetName}`}
                      >
                        {`https://near.social/${context.accountId}/widget/${state.widgetName}`}
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div class="form-group">
                      <label>Widget URL</label>
                      <input
                        class="form-control"
                        defaultValue={state.widgetName || ""}
                        onChange={(e) => onInputChangeWidgetName(e)}
                      />
                      <small class="form-text text-muted">
                        A new widget configured with the form will be created.
                      </small>
                    </div>
                    <div class="form-group pt-2">
                      <label>Name</label>
                      <input
                        class="form-control"
                        defaultValue={state.name || ""}
                        onChange={(e) => onInputChangeWidgetTitle(e)}
                      />
                    </div>
                    <div class="form-group pt-2">
                      <label>Description</label>
                      <input
                        class="form-control"
                        defaultValue={state.description || ""}
                        onChange={(e) => onInputChangeWidgetDescription(e)}
                      />
                    </div>
                    <div class="form-group pt-2">
                      <label></label>
                      <Files
                        multiple={false}
                        accepts={["image/*"]}
                        minFileSize={1}
                        clickable
                        className="btn btn-outline-primary"
                        onChange={filesOnChange}
                      >
                        {state.img?.uploading ? (
                          <> Uploading </>
                        ) : (
                          "Upload Logo Application"
                        )}
                      </Files>
                    </div>
                    <div class="form-group pt-2">
                      <label></label>
                      {state.img && !state.img.uploading ? (
                        <img
                          class="rounded w-50 h-50"
                          style={{ objectFit: "cover" }}
                          src={`https://ipfs.near.social/ipfs/${state.img.cid}`}
                          alt="upload preview"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div class="form-group pt-2">
                      <label>Website</label>
                      <input
                        class="form-control"
                        defaultValue={state.website || ""}
                        onChange={(e) => onInputChangeWidgetWebsite(e)}
                      />
                    </div>
                    <div class="form-group pt-2">
                      <label>Tags</label>

                      <Typeahead
                        options={state.tags || []}
                        multiple
                        onChange={(value) => {
                          State.update({ choose: value });
                        }}
                        placeholder="Input tag..."
                      />
                    </div>
                  </>
                )}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>

                <button
                  type="button"
                  disabled={state.clicked}
                  onClick={exportForm}
                  class="btn btn-primary"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="form-group col-md-6">
        <h6 class="mb-2">Html Element </h6>
        <textarea
          style={{ height: "400px" }}
          class="form-control w-100"
          placeholder="HTML"
          value={state.htmlElement}
          onChange={(e) => cHTML(e)}
        ></textarea>
      </div>

      <div
        class="form-group col-md-6"
        dangerouslySetInnerHTML={{ __html: state.htmlElement }}
      >
        <h6 class="mb-2">Preview</h6>
        <iframe
          style={{ height: "400px" }}
          className="w-100 border"
          srcDoc={state.htmlDocs}
        />
      </div>
    </div>
  </>
);
