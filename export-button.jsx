State.init({
  cMethod: props.cMethod,
  widgetName: `MagicBuild-widget-form-${Date.now()}`,
});
const onSwitchChangeArgExport = (fIndex) => {
  const abiMethod = state.cMethod;
  abiMethod[fIndex].export = !abiMethod[fIndex].export;
  State.update({ cMethod: abiMethod });
};
const onInputChangeWidgetName = ({ target }) => {
  State.update({ widgetName: target.value.replaceAll(" ", "-") });
};
const saveClient = () => {
  const abi = {
    schema_version: "0.3.0",
    address: props.contractAddress,
    metadata: {
      name: "",
      version: "0.1.0",
      authors: [""],
    },
    body: {
      functions: [],
    },
  };

  const abiMethod = state.cMethod;
  abiMethod.forEach((item) => {
    abi.body.functions.push(item);
  });

  const data = {
    magicbuild: {
      client: {
        [props.id]: {
          abi: JSON.stringify(abi),
        },
      },
    },
  };
  Social.set(data, {
    force: true,
    onCommit: () => {},
    onCancel: () => {},
  });
};
const exportForm = () => {
  const abi = {
    schema_version: "0.3.0",
    address: props.contractAddress,
    metadata: {
      name: "",
      version: "0.1.0",
      authors: [""],
    },
    body: {
      functions: [],
    },
  };

  const abiMethod = state.cMethod;
  abiMethod.forEach((item) => {
    abi.body.functions.push(item);
  });

  const data = {
    widget: {
      [state.widgetName]: {
        "":
          "const user = context.accountId;\r\nconst props = " +
          JSON.stringify(abi).replaceAll("\\", "") +
          " \r\n\r\nreturn (\r\n  <>\r\n    <Widget src={'magicbuild.near/widget/widget'} props={props} />\r\n  </>\r\n);\r\n",
      },
    },
  };
  console.log("abi", abi);
  Social.set(data, {
    force: true,
    onCommit: () => {},
    onCancel: () => {},
  });
};
return (
  <>
    <label></label>
    <button
      data-bs-toggle="modal"
      data-bs-target="#export"
      class="btn btn-dark form-control "
    >
      Export
    </button>
    <div
      class="modal fade"
      id="export"
      tabindex="-1"
      aria-labelledby="exportLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exportLabel">
              Choose Method to Export
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
              <label>Widget Name</label>
              <input
                class="form-control"
                defaultValue={state.widgetName}
                onChange={(e) => onInputChangeWidgetName(e)}
              />
              <small class="form-text text-muted">
                A new widget configured with the form will be created.
              </small>
            </div>
            {state.cMethod &&
              state.cMethod.map((functions, fIndex) => (
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={functions.export}
                    onChange={() => onSwitchChangeArgExport(fIndex)}
                    id={`flexSwitchCheckDefaultView${fIndex}`}
                  />
                  <label
                    class="form-check-label"
                    for={`flexSwitchCheckDefault${fIndex}`}
                  >
                    {functions.name}
                  </label>
                </div>
              ))}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            {props.id && (
              <button
                type="button"
                onClick={saveClient}
                class="btn btn-primary"
              >
                Save Client
              </button>
            )}

            <button type="button" onClick={exportForm} class="btn btn-primary">
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
