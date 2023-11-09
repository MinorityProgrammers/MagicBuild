State.init({
  blockList: {},
  openModalBlock: false,
  clickedModalBlock: false,
  clientName: props.clientName ? props.clientName : "",
  clientId: props.clientId ? props.clientId : null,
  showModalClient: false,
  selectBlock,
  selectPositionBlock,
  widgetUrl,
  widgetProps,
  widgetName: "",
  widgetLogo: [],
  name: "",
  description: "",
  website: "",
  image: {
    ipfs_cid: "",
  },
  exportList,
  clicked: false,
  export: false,
  img: null,
  tags,
  choose,
  blockWidgetPattern,
});

const addBlock = (widgetUrl, widgetProps) => {
  const blockList = state.blockList;
  const id = Date.now();
  const block = {
    [id]: {
      widgetUrl: widgetUrl,
      props: widgetProps || {},
      type: "block",
    },
  };
  Object.assign(blockList, block);
  State.update({ blockList: blockList, openModalBlock: false });
};
const selectWidget = (widgetUrl) => {
  if (state.selectBlock) {
    const blockList = state.blockList;
    const selectBlock = state.selectBlock;
    const block = {
      ["block-" + state.selectPositionBlock]: {
        widgetUrl: widgetUrl,
        props: widgetProps || {},
        type: "block",
      },
    };
    Object.assign(blockList[selectBlock], block);
    console.log(blockList);
    State.update({ blockList: blockList, openModalBlock: false });
  } else {
    addBlock(widgetUrl, {});
  }
  State.update({ selectBlock: null, selectPositionBlock: null });
};
const selectLayout = (layoutType) => {
  const blockList = state.blockList;
  const id = Date.now();
  const block = {
    [id]: { layoutType: layoutType, type: "layout" },
  };
  Object.assign(blockList, block);
  State.update({ blockList: blockList, openModalBlock: false });
};
const removeBlock = (blockId) => {
  const blockList = state.blockList;
  delete blockList[blockId];
  State.update({ blockList: blockList });
};
const removeBlockLayout = (blockId, PositionBlock) => {
  const blockList = state.blockList;
  delete blockList[blockId][PositionBlock];
  State.update({ blockList: blockList });
};
const openModalBlock = (e, type) => {
  if (type == "show") {
    State.update({ openModalBlock: true, clicked: false });
  }
  if (type == "close") {
    State.update({ selectBlock: null, selectPositionBlock: null });
    State.update({ openModalBlock: false });
  }
};

const loadWidgetList = () => {
  const exportListData = Social.get(
    `${context.accountId}/magicbuild/widgetList`
  );
  if (exportListData) {
    const exportList = JSON.parse(exportListData);
    State.update({ exportList: exportList });
  }
};

loadWidgetList();

const onInputChangeClientName = ({ target }) => {
  State.update({ clientName: target.value });
  State.update({ clicked: false });
};
const showModal = (e, type) => {
  if (type == "show") {
    State.update({ displayModal: true, clicked: false });
  }
  if (type == "close") {
    State.update({ displayModal: false });
  }
};
const showModalClient = (e, type) => {
  if (type == "show") {
    State.update({ showModalClient: true, clicked: false });
  }
  if (type == "close") {
    State.update({ showModalClient: false });
  }
};
const saveClient = (e) => {
  if (!state.clicked) {
    State.update({ clicked: true });
    if (state.clientName.length < 5) {
      State.update({
        error: "Name requires more than 5 characters",
      });
    } else {
      const saveData = {
        magicbuild: {
          blockList: blockList,
        },
      };
      Social.set(saveData, {
        force: true,
        onCommit: () => {
          State.update({ displayModal: false });
        },
        onCancel: () => {},
      });
    }
  }
};
const loadData = () => {
  const widgetListGet = Social.get(
    `${context.accountId}/magicbuild/widgetList`
  );
  if (widgetListGet) {
    const widgetList = JSON.parse(widgetListGet);
    const widgetLogo = {};
    for (const widget of widgetList) {
      const logoWidgets = Social.get(
        `${context.accountId}/widget/${widget.widgetName}/metadata/image/ipfs_cid`
      );
      const widgetName = widget.widgetName;
      if (logoWidgets) Object.assign(widgetLogo, { [widgetName]: logoWidgets });
    }
    State.update({ widgetLogo: widgetLogo });
    State.update({ clientList: clientListData });
  }

  const blockWidgetPattern = {
    button2: {
      widgetName: "Button 2",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0002",
      props: { text: "button" },
      type: "block",
    },
    button3: {
      widgetName: "Button 3",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0003",
      props: { text: "button" },
      type: "block",
    },
    button4: {
      widgetName: "Button 4",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0004",
      props: { text: "button" },
      type: "block",
    },
    button5: {
      widgetName: "Button 5",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0005",
      props: { text: "button" },
      type: "block",
    },
    button6: {
      widgetName: "Button 6",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0006",
      props: { text: "button" },
      type: "block",
    },
    button7: {
      widgetName: "Button 7",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0007",
      props: { text: "button" },
      type: "block",
    },
    button8: {
      widgetName: "Button 8",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0008",
      props: { text: "button" },
      type: "block",
    },
    button9: {
      widgetName: "Button 9",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0009",
      props: { text: "button" },
      type: "block",
    },
    button10: {
      widgetName: "Button 10",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0010",
      props: { text: "button" },
      type: "block",
    },
    button11: {
      widgetName: "Button 11",
      widgetUrl: "marketplacebos.near/widget/Button.ButtonP.Button0011",
      props: { text: "button" },
      type: "block",
    },
    cbd1: {
      widgetName: "cbd 1",
      widgetUrl: "marketplacebos.near/widget/CB.CBP.CB0001",
      props: {},
      type: "block",
    },
    cbd2: {
      widgetName: "cbd 2",
      widgetUrl: "marketplacebos.near/widget/CB.CBP.CB0002",
      props: {},
      type: "block",
    },
    cbd3: {
      widgetName: "cbd 3",
      widgetUrl: "marketplacebos.near/widget/CB.CBP.CB0003",
      props: {},
      type: "block",
    },
    cbd4: {
      widgetName: "cbd 4",
      widgetUrl: "marketplacebos.near/widget/CB.CBP.CB0004",
      props: {},
      type: "block",
    },
    cbd5: {
      widgetName: "cbd 5",
      widgetUrl: "marketplacebos.near/widget/CB.CBP.CB0005",
      props: {},
      type: "block",
    },
    cbd6: {
      widgetName: "cbd 6",
      widgetUrl: "marketplacebos.near/widget/CB.CBP.CB0006",
      props: {},
      type: "block",
    },
    input1: {
      widgetName: "input 1",
      widgetUrl: "marketplacebos.near/widget/Input.InputP.Input0001",
      props: {},
      type: "block",
    },
    input2: {
      widgetName: "input 2",
      widgetUrl: "marketplacebos.near/widget/Input.InputP.Input0002",
      props: {},
      type: "block",
    },
    input3: {
      widgetName: "input 3",
      widgetUrl: "marketplacebos.near/widget/Input.InputP.Input0003",
      props: {},
      type: "block",
    },
    loader1: {
      widgetName: "loader 1",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0001",
      props: {},
      type: "block",
    },
    loader2: {
      widgetName: "loader 2",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0002",
      props: {},
      type: "block",
    },
    loader3: {
      widgetName: "loader 3",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0003",
      props: {},
      type: "block",
    },
    loader4: {
      widgetName: "loader 4",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0004",
      props: {},
      type: "block",
    },
    loader5: {
      widgetName: "loader 5",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0005",
      props: {},
      type: "block",
    },
    loader6: {
      widgetName: "loader 6",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0006",
      props: {},
      type: "block",
    },
    loader7: {
      widgetName: "loader 7",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0007",
      props: {},
      type: "block",
    },
    loader8: {
      widgetName: "loader 8",
      widgetUrl: "marketplacebos.near/widget/Loader.LoaderP.Loader0008",
      props: {},
      type: "block",
    },
    radio1: {
      widgetName: "radio 1",
      widgetUrl: "marketplacebos.near/widget/Radio.RadioP.Radio0001",
      props: {},
      type: "block",
    },
    radio2: {
      widgetName: "radio 2",
      widgetUrl: "marketplacebos.near/widget/Radio.RadioP.Radio0002",
      props: {},
      type: "block",
    },
    pattern1: {
      widgetName: "pattern 1",
      widgetUrl: "marketplacebos.near/widget/Pattern.PatternP.Pattern0001",
      props: { text: "text" },
      type: "block",
    },
    pattern2: {
      widgetName: "pattern 2",
      widgetUrl: "marketplacebos.near/widget/Pattern.PatternP.Pattern0002",
      props: { text: "text" },
      type: "block",
    },
    pattern3: {
      widgetName: "pattern 3",
      widgetUrl: "marketplacebos.near/widget/Pattern.PatternP.Pattern0003",
      props: { text: "text" },
      type: "block",
    },
    pattern4: {
      widgetName: "pattern 4",
      widgetUrl: "marketplacebos.near/widget/Pattern.PatternP.Pattern0004",
      props: { text: "text" },
      type: "block",
    },
    pattern5: {
      widgetName: "pattern 5",
      widgetUrl: "marketplacebos.near/widget/Pattern.PatternP.Pattern0005",
      props: { text: "text" },
      type: "block",
    },
    pattern6: {
      widgetName: "pattern 6",
      widgetUrl: "marketplacebos.near/widget/Pattern.PatternP.Pattern0006",
      props: { text: "text" },
      type: "block",
    },
    pattern7: {
      widgetName: "pattern 7",
      widgetUrl: "marketplacebos.near/widget/Pattern.PatternP.Pattern0006",
      props: { text: "text" },
      type: "block",
    },
    chart1: {
      widgetName: "chart 1",
      widgetUrl: "marketplacebos.near/widget/Chart.ChartP.Chart0001",
      props: { text: "text" },
      type: "block",
    },
    chart2: {
      widgetName: "chart 2",
      widgetUrl: "marketplacebos.near/widget/Chart.ChartP.Chart0002",
      props: { text: "text" },
      type: "block",
    },
    chart3: {
      widgetName: "chart 3",
      widgetUrl: "marketplacebos.near/widget/Chart.ChartP.Chart0003",
      props: { text: "text" },
      type: "block",
    },
    chart4: {
      widgetName: "chart 4",
      widgetUrl: "marketplacebos.near/widget/Chart.ChartP.Chart0004",
      props: { text: "text" },
      type: "block",
    },
  };
  State.update({ blockWidgetPattern: blockWidgetPattern });
};
loadData();
const onInputChangeWidgetUrl = (e) => {
  State.update({ widgetUrl: e.target.value });
};
const onInputChangeWidgetProps = (e) => {
  State.update({ widgetPropst: e.target.value });
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
    const exportSource = "return <>";
    for (const blockId of Object.keys(state.blockList)) {
      console.log(state.blockList[blockId]);
      if (state.blockList[blockId].type == "block") {
        exportSource += `<Widget src={"${
          state.blockList[blockId].widgetUrl
        }"} props={JSON.parse(${JSON.stringify(
          state.blockList[blockId].props
        )})} />`;
      }
      if (state.blockList[blockId].type == "layout") {
        if (state.blockList[blockId].layoutType == "50-50") {
          exportSource += `<div class="row mb-3">`;
          exportSource += `<div class="col-md-6 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-1"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-1"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `<div class="col-md-6 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-2"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-2"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `</div>`;
        }
        if (state.blockList[blockId].layoutType == "33-66") {
          exportSource += `<div class="row mb-3">`;
          exportSource += `<div class="col-md-3 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-1"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-1"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `<div class="col-md-9 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-2"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-2"].props
          )})} /> `;
          exportSource += `</div>
          </div>`;
        }
        if (state.blockList[blockId].layoutType == "66-33") {
          exportSource += `<div class="row mb-3">`;
          exportSource += `<div class="col-md-9 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-1"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-1"].props
          )})} /> `;
          exportSource += `</div>`;

          exportSource += `<div class="col-md-3 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-2"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-2"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `</div>`;
        }
        if (state.blockList[blockId].layoutType == "33-33-33") {
          exportSource += `<div class="row mb-3">`;
          exportSource += ` <div class="col-md-4 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-1"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-1"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `<div class="col-md-4 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-2"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-2"].props
          )})} /> `;
          exportSource += `</div>`;

          exportSource += `<div class="col-md-4 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-3"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-3"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `</div>`;
        }
        if (state.blockList[blockId].layoutType == "25-50-25") {
          exportSource += `<div class="row mb-3">`;
          exportSource += ` <div class="col-md-3 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-1"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-1"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `<div class="col-md-6 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-2"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-2"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `<div class="col-md-3 p-2">`;
          exportSource += `<Widget src={"${
            state.blockList[blockId]["block-3"].widgetUrl
          }"} props={JSON.parse(${JSON.stringify(
            state.blockList[blockId]["block-3"].props
          )})} /> `;
          exportSource += `</div>`;
          exportSource += `</div>`;
        }
      }
    }
    exportSource += " </>";
    console.log(state.blockList);
    const data = {
      widget: {
        [state.widgetName]: {
          "": exportSource,
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
  <div class="container ">
    {state.openModalBlock && (
      <>
        <div
          style={{ display: "block" }}
          className={`modal fade show`}
          id="addBlock"
          tabindex="-1"
          aria-labelledby="addBlockLabel"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="addBlockLabel">
                  Choose Block
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  onClick={(e) => openModalBlock(e, "close")}
                ></button>
              </div>
              <div class="modal-body">
                <ul class="nav nav-tabs" role="tablistBlock">
                  {!state.selectBlock && (
                    <li class="nav-item" role="presentation">
                      <span
                        class="nav-link px-3 "
                        id="layout-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-layout-list"
                        type="button"
                        role="tab"
                        aria-controls="pills-layout-list"
                        aria-selected="true"
                      >
                        Layout
                      </span>
                    </li>
                  )}
                  <li class="nav-item" role="presentation">
                    <span
                      class="nav-link px-3 active "
                      id="block-list-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-block-list"
                      type="button"
                      role="tab"
                      aria-controls="pills-block-list-label"
                      aria-selected="true"
                    >
                      Block
                    </span>
                  </li>

                  <li class="nav-item" role="presentation">
                    <span
                      class="nav-link px-3"
                      id="export-list-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-export-list"
                      type="button"
                      role="tab"
                      aria-controls="pills-export-list"
                      aria-selected="true"
                    >
                      Your Exported
                    </span>
                  </li>
                  <li class="nav-item" role="presentation">
                    <span
                      class="nav-link px-3"
                      id="export-self-customize-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-self-customize-list"
                      type="button"
                      role="tab"
                      aria-controls="pills-self-customize-list"
                      aria-selected="true"
                    >
                      Import Widget
                    </span>
                  </li>
                </ul>

                <div class="tab-content">
                  <div
                    class="tab-pane fade "
                    id={`pills-layout-list`}
                    role="tabpanel"
                    aria-labelledby={`pills-tab-layout-list`}
                    tabindex="0"
                  >
                    <div class="row m-3 overflow-auto ">
                      <div class="col m-2">
                        <div
                          class="card p-2 align-items-center"
                          style={{ width: "130px" }}
                          onClick={(e) => selectLayout("50-50")}
                        >
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H25V34H39ZM23 34H9V14H23V34Z"
                            ></path>
                          </svg>
                          <div class="card-body p-0">
                            <span
                              class="card-text  d-inline-block text-truncate "
                              style={{
                                maxWidth: "120px",
                                fontWeight: "bold",
                              }}
                            >
                              50/50
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col m-2">
                        <div
                          class="card p-2 align-items-center"
                          style={{ width: "130px" }}
                          onClick={(e) => selectLayout("33-66")}
                        >
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H20V34H39ZM18 34H9V14H18V34Z"
                            ></path>
                          </svg>
                          <div class="card-body p-0">
                            <span
                              class="card-text  d-inline-block text-truncate "
                              style={{
                                maxWidth: "120px",
                                fontWeight: "bold",
                              }}
                            >
                              33/66
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col m-2 ">
                        <div
                          class="card p-2 align-items-center"
                          style={{ width: "130px" }}
                          onClick={(e) => selectLayout("66-33")}
                        >
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H30V34H39ZM28 34H9V14H28V34Z"
                            ></path>
                          </svg>
                          <div class="card-body p-0">
                            <span
                              class="card-text  d-inline-block text-truncate "
                              style={{
                                maxWidth: "120px",
                                fontWeight: "bold",
                              }}
                            >
                              66/33
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col m-2 ">
                        <div
                          class="card p-2 align-items-center"
                          style={{ width: "130px" }}
                          onClick={(e) => selectLayout("33-33-33")}
                        >
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM28.5 34h-9V14h9v20zm2 0V14H39v20h-8.5zm-13 0H9V14h8.5v20z"
                            ></path>
                          </svg>
                          <div class="card-body p-0">
                            <span
                              class="card-text  d-inline-block text-truncate "
                              style={{
                                maxWidth: "120px",
                                fontWeight: "bold",
                              }}
                            >
                              33/33/33
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="col m-2 ">
                        <div
                          class="card p-2 align-items-center"
                          style={{ width: "130px" }}
                          onClick={(e) => selectLayout("25-50-25")}
                        >
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM31 34H17V14h14v20zm2 0V14h6v20h-6zm-18 0H9V14h6v20z"
                            ></path>
                          </svg>
                          <div class="card-body p-0">
                            <span
                              class="card-text  d-inline-block text-truncate "
                              style={{
                                maxWidth: "120px",
                                fontWeight: "bold",
                              }}
                            >
                              25/50/25
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="tab-pane fade  "
                    id={`pills-export-list`}
                    role="tabpanel"
                    aria-labelledby={`pills-export-list`}
                    tabindex="0"
                  >
                    <div
                      class="row m-3 overflow-auto "
                      style={{ height: "600px" }}
                    >
                      {state.exportList &&
                        state.exportList.map((widget, index) => (
                          <div class="col m-2">
                            <div
                              class="card p-2 align-items-center"
                              style={{ width: "130px", height: "180px" }}
                              onClick={(e) =>
                                selectWidget(
                                  `${context.accountId}/widget/${widget.widgetName}`
                                )
                              }
                            >
                              <img
                                src={
                                  state.widgetLogo[widget.widgetName]
                                    ? `https://ipfs.near.social/ipfs/${
                                        state.widgetLogo[widget.widgetName]
                                      }`
                                    : "https://ipfs.near.social/ipfs/bafkreido7gsk4dlb63z3s5yirkkgrjs2nmyar5bxyet66chakt2h5jve6e"
                                }
                                class="card-img-top"
                                alt="..."
                              />
                              <div class="card-body p-0">
                                <span
                                  class="card-text  d-inline-block text-truncate "
                                  style={{
                                    maxWidth: "120px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {widget.widgetName}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div
                    class="tab-pane fade show active"
                    id={`pills-block-list`}
                    role="tabpanel"
                    aria-labelledby={`pills-block-list`}
                    tabindex="0"
                  >
                    <div
                      class="row m-3 overflow-auto "
                      style={{ height: "600px" }}
                    >
                      {state.blockWidgetPattern &&
                        Object.keys(state.blockWidgetPattern).map(
                          (widget, index) => (
                            <div class="col m-2">
                              <div
                                class="card p-2 align-items-center"
                                style={{ width: "150px", height: "150px" }}
                                onClick={(e) =>
                                  selectWidget(
                                    `${state.blockWidgetPattern[widget].widgetUrl}`
                                  )
                                }
                              >
                                <Widget
                                  src={
                                    state.blockWidgetPattern[widget].widgetUrl
                                  }
                                  props={state.blockWidgetPattern[widget].props}
                                />
                                <div class="card-body p-0">
                                  <span
                                    class="card-text  d-inline-block text-truncate "
                                    style={{
                                      maxWidth: "120px",
                                      fontWeight: "120px",
                                    }}
                                  >
                                    {
                                      state.blockWidgetPattern[widget]
                                        .widgetName
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                  <div
                    class="tab-pane fade "
                    id={`pills-self-customize-list`}
                    role="tabpanel"
                    aria-labelledby={`pills-tab-self-customize-list`}
                    tabindex="0"
                  >
                    <div class="row m-3">
                      <div class="form-group col-md-12 ">
                        <div class="card mb-2">
                          <div class="card-header">Block</div>
                          <div class="card-body">
                            <div class="form-group">
                              <label>Widget Url:</label>
                              <input
                                class="form-control"
                                value={state.widgetUrl}
                                onChange={(e) => onInputChangeWidgetUrl(e)}
                              />
                            </div>
                            <div class="form-group">
                              <label>Props:</label>
                              <input
                                class="form-control"
                                value={state.widgetProps}
                                onChange={(e) => onInputChangeWidgetProps(e)}
                              />
                            </div>
                          </div>
                        </div>
                        <div class="card">
                          <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                              <button class="btn btn-link">Preview</button>
                            </h5>
                          </div>

                          <div id="collapseOne" class="collapse show">
                            <div class="card-body">
                              {state.widgetUrl ? (
                                <Widget
                                  src={state.widgetUrl}
                                  props={state.props || null}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                        <div class="text-mute pt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              addBlock(state.widgetUrl, state.widgetProps);
                            }}
                            class="btn btn-primary"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  onClick={(e) => openModalBlock(e, "close")}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-backdrop fade show"></div>
      </>
    )}
    <div class="row mb-3">
      <div class="form-group col-md-9 border rounded p-3 border-2">
        <div>
          {Object.keys(state.blockList) &&
            Object.keys(state.blockList).map((blockId, index) => (
              <div class="row border rounded p-3 border-2 m-2 ">
                {state.blockList[blockId].type == "block" && (
                  <>
                    <div class="row pb-2">
                      <div class="col-sm-11 ">
                        <h6>
                          <span class="text-info">
                            {state.blockList[blockId].layoutType}
                          </span>
                        </h6>
                      </div>
                      <div class="col-sm-1 ">
                        <button
                          type="button"
                          onClick={(e) => removeBlock(blockId)}
                          class="btn-close"
                        ></button>
                      </div>
                    </div>
                    <Widget
                      src={state.blockList[blockId].widgetUrl}
                      props={state.blockList[blockId].props}
                    />
                  </>
                )}
                {state.blockList[blockId].type == "layout" && (
                  <>
                    <div class="row pb-2">
                      <div class="col-sm-11 ">
                        <h6>
                          <span class="text-info">
                            {state.blockList[blockId].layoutType}
                          </span>
                        </h6>
                      </div>
                      <div class="col-sm-1 ">
                        <button
                          type="button"
                          onClick={(e) => removeBlock(blockId)}
                          class="btn-close"
                        ></button>
                      </div>
                    </div>
                    {state.blockList[blockId].layoutType == "50-50" && (
                      <div class="row align-items-center">
                        <div class="col-sm-6 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-1"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-1"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-1")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-1"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-1"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 1,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                        <div class="col-sm-6 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-2"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-2"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-2")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-2"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-2"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 2,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {state.blockList[blockId].layoutType == "33-66" && (
                      <div class="row align-items-center">
                        <div class="col-sm-3 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-1"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-1"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-1")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-1"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-1"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 1,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                        <div class="col-sm-9 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-2"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-2"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-2")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-2"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-2"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 2,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {state.blockList[blockId].layoutType == "66-33" && (
                      <div class="row align-items-center">
                        <div class="col-sm-9 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-1"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-1"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-1")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-1"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-1"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 1,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                        <div class="col-sm-3 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-2"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-2"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-2")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-2"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-2"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 2,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {state.blockList[blockId].layoutType == "33-33-33" && (
                      <div class="row align-items-center">
                        <div class="col-sm-4 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-1"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-1"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-1")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-1"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-1"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 1,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                        <div class="col-sm-4 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-2"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-2"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-2")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-2"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-2"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 2,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                        <div class="col-sm-4 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-3"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-3"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-3")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-3"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-3"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 3,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {state.blockList[blockId].layoutType == "25-50-25" && (
                      <div class="row align-items-center">
                        <div class="col-sm-3 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-1"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-1"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-1")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-1"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-1"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 1,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                        <div class="col-sm-6 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-2"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-2"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-2")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-2"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-2"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 2,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                        <div class="col-sm-3 border rounded p-3 border-2  ">
                          {state.blockList[blockId]["block-3"] ? (
                            <>
                              <div class="row pb-2">
                                <div class="col-sm-11 ">
                                  <h6>
                                    <span class="text-info">
                                      {
                                        state.blockList[blockId]["block-3"]
                                          .widgetUrl
                                      }
                                    </span>
                                  </h6>
                                </div>
                                <div class="col-sm-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeBlockLayout(blockId, "block-3")
                                    }
                                    class="btn-close"
                                  ></button>
                                </div>
                              </div>
                              <Widget
                                src={
                                  state.blockList[blockId]["block-3"].widgetUrl
                                }
                                props={
                                  state.blockList[blockId]["block-3"].props
                                }
                              />
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                openModalBlock(e, "show");
                                State.update({
                                  selectBlock: blockId,
                                });
                                State.update({
                                  selectPositionBlock: 3,
                                });
                              }}
                              class="btn btn-outline-primary btn-lg btn-block"
                            >
                              Add Block +
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
        <button
          type="button"
          onClick={(e) => openModalBlock(e, "show")}
          class="btn btn-outline-primary btn-lg btn-block"
        >
          Add Block +
        </button>
      </div>
      <div class="form-group col-md-3 ">
        <div class="card">
          <div class="card-header">Custom</div>
          <div class="card-body">
            <ul class="nav nav-tabs" role="tablistBlock">
              <li class="nav-item" role="presentation">
                <span
                  class="nav-link px-3 active"
                  id="export-button"
                  data-bs-toggle="pill"
                  data-bs-target="#export-button"
                  type="button"
                  role="tab"
                  aria-controls="export-button"
                  aria-selected="true"
                >
                  Export to Widget
                </span>
              </li>
              <li class="nav-item" role="presentation">
                <span
                  class="nav-link px-3 "
                  id="layout-tab-home"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-layout-list"
                  type="button"
                  role="tab"
                  aria-controls="pills-layout-list"
                  aria-selected="true"
                >
                  CSS
                </span>
              </li>
            </ul>

            <div class="tab-content">
              <div
                class="tab-pane fade show active "
                id={`export-button`}
                role="tabpanel"
                aria-labelledby={`export-buttont`}
                tabindex="0"
              >
                <div class="row m-1">
                  <button
                    type="button"
                    class="btn btn-primary btn-block m-1"
                    data-bs-toggle="modal"
                    data-bs-target={`#export-${Date.now()}`}
                    onClick={openModal}
                  >
                    Export
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
                                  A new widget configured with the form will be
                                  created.
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
                                  onChange={(e) =>
                                    onInputChangeWidgetDescription(e)
                                  }
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
                                  onChange={(e) =>
                                    onInputChangeWidgetWebsite(e)
                                  }
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
                  <button
                    type="button"
                    onClick={(e) => showModalClient(e, "show")}
                    class="btn btn-success btn-block m-1"
                  >
                    Save Client
                  </button>
                  {state.showModalClient && (
                    <>
                      <div
                        style={{ display: "block" }}
                        className={`modal fade show`}
                        id="createClient"
                        tabindex="-1"
                        aria-labelledby="createClientLabel"
                      >
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1
                                class="modal-title fs-5"
                                id="createClientLabel"
                              >
                                Save Client
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                onClick={(e) => showModalClient(e, "close")}
                              ></button>
                            </div>
                            <div class="modal-body">
                              <div class="form-group">
                                <label>Name</label>
                                <input
                                  class="form-control"
                                  value={state.clientName}
                                  onChange={(e) => onInputChangeClientName(e)}
                                />
                              </div>
                              <small class="form-text text-muted">
                                A new Client will be created.
                              </small>

                              {state.error && (
                                <p class="text-danger" role="alert">
                                  {state.error}
                                </p>
                              )}
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                class="btn btn-secondary"
                                onClick={(e) => showModalClient(e, "close")}
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                disabled={state.clicked}
                                onClick={(e) => saveClient(e)}
                                class="btn btn-primary"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="modal-backdrop fade show"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
