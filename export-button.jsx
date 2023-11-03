State.init({
  cMethod: props.cMethod,
  widgetName: props.widgetName || `MagicBuild-widget-form-${Date.now()}`,
  name: "",
  description: "",
  website: "",
  image: {
    ipfs_cid: "",
  },
  tags: {},
  clicked: false,
  export: false,
  img: null,
  tags,
  choose,
});
const onInputChangeWidgetName = ({ target }) => {
  State.update({ widgetName: target.value.replaceAll(" ", "-") });
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

const openModal = () => {
  State.update({ clicked: false });
  State.update({ export: false });
  const taggedWidgets = Social.keys(`*/widget/*/metadata/tags/*`, "final");
  let tags = [];
  Object.keys(taggedWidgets).forEach((item) => {
    if (Object.keys(taggedWidgets[item].widget)) {
      if (Object.keys(taggedWidgets[item].widget).length > 0) {
        Object.keys(taggedWidgets[item].widget).forEach((item1) => {
          if (taggedWidgets[item].widget[item1].metadata.tags) {
            if (
              Object.keys(
                taggedWidgets[item].widget[item1].metadata.tags.length > 0
              )
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
  State.update({ tags: tags });
};
const exportForm = () => {
  if (!state.clicked) {
    State.update({ clicked: true });
    const abi = {
      schema_version: "0.3.0",
      address: props.contractAddress,
      cssStyle: props.cssStyle,
      metadata: {
        name: "",
        version: "0.1.0",
        authors: [""],
      },
      body: {
        functions: [],
      },
    };

    const tagsObj = state.choose.reduce((accumulator, value) => {
      return { ...accumulator, [value]: "" };
    }, {});
    const abiMethod = state.cMethod;
    abiMethod.forEach((item) => {
      abi.body.functions.push(item);
    });
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
          "":
            "const user = context.accountId;\r\nconst props = " +
            JSON.stringify(abi).replaceAll("\\", "") +
            " \r\n\r\nreturn (\r\n  <>\r\n    <Widget src={'magicbuild.near/widget/widget'} props={props} />\r\n  </>\r\n);\r\n",
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
return (
  <>
    {state.export && state.widgetName ? (
      <>
        <hr />
        <h5>Export Success</h5>
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
        <label></label>
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
                  {state.tags.length > 0 && (
                    <Typeahead
                      options={state.tags}
                      multiple
                      onChange={(value) => {
                        State.update({ choose: value });
                      }}
                      placeholder="Input tag..."
                    />
                  )}
                </div>
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
      </>
    )}
  </>
);
