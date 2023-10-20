State.init({
  id: props.id ? props.id : null,
  contractAddress: props.address ? props.address : "",
  cMethod: props.abi.body.functions ? props.abi.body.functions : [],
  rpcUrl: "https://rpc.near.org/",
  archivalRpc: "https://archival-rpc.mainnet.near.org",
  nearBlockRpc: "https://api.nearblocks.io/",
  fName,
  fAction: "view",
  fLabel,
  cMerr,
  res,
  cAerr,
});
const header = {
  "Content-Type": "application/json",
};

const cFunc = (e, type) => {
  const data = e.target.value;
  if (type == "name") State.update({ fName: data });
  if (type == "label") State.update({ fLabel: data });
  if (type == "action") State.update({ fAction: data });
  if (type == "address") State.update({ contractAddress: data.toLowerCase() });
};
const cep = "magicbuild.near";
const onCreateArgs = (fName, fIndex) => {
  State.update({ cAerr: { [fName]: null } });
  const arg = {
    name: "",
    label: "",
    type_schema: {
      type: "string",
    },
    value: "",
  };
  const abiMethod = state.cMethod;
  abiMethod[fIndex].params.args.push(arg);
  State.update({ cMethod: abiMethod });
};
const cMLabel = (e, fIdx, type) => {
  const value = e.target.value;
  const a = state.cMethod;
  if (type == "method") a[fIdx].label = value;
  if (type == "button") a[fIdx].button = value;
  if (type == "gas") a[fIdx].gas = value;
  if (type == "deposit") a[fIdx].deposit = value;
  if (type == "remove") a.splice(fIdx, 1);
  State.update({ cMethod: a });
};
const cAD = (e, fIdx, aIdx, type) => {
  const value = e.target.value;
  const a = state.cMethod;
  if (type == "name") a[fIdx].params.args[aIdx].name = value;
  if (type == "label") a[fIdx].params.args[aIdx].label = value;
  if (type == "type") a[fIdx].params.args[aIdx].type_schema.type = value;
  if (type == "value") a[fIdx].params.args[aIdx].value = value;
  if (type == "remove") a[fIdx].params.args.splice(aIdx, 1);
  State.update({ cMethod: a });
};
const onCreateMethod = () => {
  if (state.fName.length > 0) {
    State.update({ cMerr: null });
    const method = {
      name: state.fName,
      kind: state.fAction,
      label: state.fLabel,
      button: "",
      export: true,
      params: {
        serialization_type: "json",
        args: [],
      },
      deposit: 0,
      gas: 30000000000000,
    };
    const abiMethod = state.cMethod;
    const isExistFunction = false;
    abiMethod.forEach((item) => {
      if (item.name == state.fName) {
        isExistFunction = true;
      }
    });
    if (!isExistFunction) {
      abiMethod.push(method);
      State.update({ cMethod: abiMethod });
    } else {
      State.update({ cMerr: "Method Exist!" });
    }
  } else {
    State.update({ cMerr: "Please Input Method Name!" });
  }
};
const getMethodFromSource = () => {
  State.update({ cMerr: null, cMethod: [] });
  const res = fetch(state.rpcUrl, {
    body: JSON.stringify({
      method: "query",
      params: {
        request_type: "view_code",
        account_id: state.contractAddress,
        finality: "final",
      },
      id: 154,
      jsonrpc: "2.0",
    }),
    headers: header,
    method: "POST",
  });
  let abiMethod = [];
  const resb = res.body;
  if (resb.result) {
    const data = Buffer(resb.result.code_base64, "base64").toString("ascii");
    const fist = data.indexOf("memory");
    let second =
      data.indexOf("__data_end") !== -1
        ? data.indexOf("__data_end")
        : data.indexOf("P]");
    if (fist !== -1 && second !== -1) {
      const functionsData = data
        .substring(fist, second)
        .replace(/[^\w ]/g, " ")
        .split(" ");
      const filterFunction = [];
      functionsData.forEach((item, index) => {
        if (index > 0 && item.length > 1) {
          if (!/^[A-Z]+(?:_[A-Z]+)*$/m.test(item) && !/^[0-9]*$/.test(string)) {
            filterFunction.push(item);
          }
        }
      });
      filterFunction.forEach((item) => {
        const res = fetch(
          `${state.nearBlockRpc}v1/account/${state.contractAddress}/txns?method=${item}&order=desc&page=1&per_page=25`,
          {
            headers: header,
            method: "GET",
          }
        );
        const method = {
          name: item,
          kind: "view",
          export: true,
          params: {
            serialization_type: "json",
            args: [],
          },
          deposit: 0,
          gas: 30000000000000,
        };
        if (res.body.txns.length > 0) {
          const isScs = false;
          res.body.txns.forEach((item) => {
            if (item.outcomes.status) {
              isScs = true;
            }
          });
          if (isScs) {
            method.kind = "call";
          }
        }
        abiMethod.push(method);
      });
      State.update({ cMethod: abiMethod });
      abiMethod.forEach((item, index) => {
        getArgsFromMethod(item.name, index);
      });
    } else State.update({ cMerr: "Unable to detect Method!" });
  } else State.update({ cMerr: "Unable to detect Method!" });
};
const getArgsFromMethod = (fName, fIndex) => {
  const res = fetch(
    `${state.nearBlockRpc}v1/account/${state.contractAddress}/txns?method=${fName}&order=desc&page=1&per_page=1`,
    {
      headers: header,
      method: "GET",
    }
  );
  const restxns = res.body.txns;
  if (restxns.length > 0 && restxns[0].transaction_hash) {
    const res = fetch(state.archivalRpc, {
      body: JSON.stringify({
        method: "EXPERIMENTAL_tx_status",
        params: [restxns[0].transaction_hash, state.contractAddress],
        id: 128,
        jsonrpc: "2.0",
      }),
      headers: header,
      method: "POST",
    });
    const restrans = res.body.result.transaction.actions[0].FunctionCall.args;
    if (restrans) {
      const args = Buffer(restrans, "base64").toString("ascii");
      if (Object.keys(JSON.parse(args)).length > 0) {
        const abiMethod = state.cMethod;
        abiMethod[fIndex].params.args = [];
        Object.keys(JSON.parse(args)).forEach((item) => {
          const arg = {
            name: item,
            type_schema: {
              type: typeof JSON.parse(args)[item],
            },
            value: "",
          };
          abiMethod[fIndex].params.args.push(arg);
          State.update({ cMethod: abiMethod });
        });
      }
    }
  } else {
    const getArg = setInterval(() => {
      const abiMethod = state.cMethod;
      const argsArr = abiMethod[fIndex].params.args;
      const argMap = argsArr.map(({ name, value }) => ({ [name]: value }));
      const args = {};
      argMap.forEach((item) => {
        Object.assign(args, item);
      });
      const res = fetch(state.rpcUrl, {
        body: JSON.stringify({
          method: "query",
          params: {
            request_type: "call_function",
            account_id: state.contractAddress,
            method_name: fName,
            args_base64: new Buffer.from(JSON.stringify(args)).toString(
              "base64"
            ),
            finality: "optimistic",
          },
          id: 154,
          jsonrpc: "2.0",
        }),
        headers: header,
        method: "POST",
      });
      const str = res.body.result.error;
      if (str && str.includes("missing field")) {
        const argName = str.substring(
          str.indexOf("`") + 1,
          str.lastIndexOf("`")
        );
        const checkType = [
          { value: "", type: "string" },
          { value: 0, type: "number" },
          { value: [], type: "array" },
          { value: true, type: "boolean" },
          { value: "", type: "enum" },
          { value: {}, type: "object" },
        ];
        const isCheck = false;
        checkType.forEach((typeItem, tI) => {
          if (isCheck == false) {
            const res = fetch(state.rpcUrl, {
              body: JSON.stringify({
                method: "query",
                params: {
                  request_type: "call_function",
                  account_id: state.contractAddress,
                  method_name: fName,
                  args_base64: new Buffer.from(
                    JSON.stringify({
                      [argName]: checkType[tI].value,
                    })
                  ).toString("base64"),
                  finality: "optimistic",
                },
                id: 154,
                jsonrpc: "2.0",
              }),
              headers: header,
              method: "POST",
            });
            const ftch = res.body.result.error;
            const uS = (argName, type, value) => {
              isCheck = true;
              const arg = {
                name: argName,
                type_schema: {
                  type: type,
                },
                value: value,
              };
              const isExist = false;
              abiMethod[fIndex].params.args.forEach((item) => {
                if (item.name == argName) {
                  isExist = true;
                }
              });
              if (isExist == false) {
                abiMethod[fIndex].params.args.push(arg);
                State.update({ cMethod: abiMethod });
              }
            };
            if (res.body.result.result || ftch.includes("Option::unwrap()`")) {
              uS(argName, typeItem.type, typeItem.value);
              clearInterval(getArg);
            }
            if (ftch.includes("the account ID")) {
              uS(argName, "$ref", state.contractAddress);
            }
            if (ftch.includes("unknown variant")) {
              isCheck = true;
              const getEnum = ftch
                .substring(
                  ftch.indexOf("expected one of") + 17,
                  ftch.lastIndexOf("\\")
                )
                .replaceAll("`", "")
                .split(",");
              uS(argName, typeItem.type, getEnum[0]);
            }

            if (ftch.includes("missing field")) {
              uS(argName, typeItem.type, typeItem.value);
            }
            if (
              ftch.includes("Requires attached deposit") ||
              ftch.includes("storage_write") ||
              ftch.includes("predecessor_account_id")
            ) {
              abiMethod[fIndex].kind = "call";
              State.update({ cMethod: abiMethod });
              clearInterval(getArg);
            }
            if (ftch.includes("MethodNotFound") || res.body.result.result) {
              clearInterval(getArg);
            }
          }
        });
      }
      setTimeout(() => {
        clearInterval(getArg);
      }, 10000);
    }, 1000);
  }
};
const onBtnClickCall = (fName, action, fIndex) => {
  const abiMethod = state.cMethod;
  const argMap = abiMethod[fIndex].params.args.map(({ name, value }) => ({
    [name]: value,
  }));
  const args = {};
  argMap.forEach((item) => {
    Object.assign(args, item);
  });
  if (action === "view") {
    asyncFetch(state.rpcUrl, {
      body: JSON.stringify({
        method: "query",
        params: {
          request_type: "call_function",
          account_id: state.contractAddress,
          method_name: abiMethod[fIndex].name,
          args_base64: new Buffer.from(JSON.stringify(args)).toString("base64"),
          finality: "final",
        },
        id: 154,
        jsonrpc: "2.0",
      }),
      headers: header,
      method: "POST",
    }).then((res) => {
      const resb = res.body.result;
      if (resb.result) {
        const result = new Buffer.from(resb.result).toString();
        State.update({
          res: {
            [fName]: { value: result, error: false },
          },
        });
      }
      if (resb.error) {
        const error = resb.error;
        State.update({
          res: {
            [fName]: { value: error, error: true },
          },
        });
      }
    });
  }
  if (action === "call") {
    if (
      abiMethod[fIndex].deposit == 0 &&
      abiMethod[fIndex].gas == 30000000000000
    ) {
      Near.call(state.contractAddress, abiMethod[fIndex].name, args);
    }
    if (
      abiMethod[fIndex].deposit > 0 ||
      abiMethod[fIndex].gas > 30000000000000
    ) {
      Near.call(
        state.contractAddress,
        abiMethod[fIndex].name,
        args,
        abiMethod[fIndex].deposit,
        abiMethod[fIndex].gas
      );
    }
  }
};
return (
  <div class="row">
    <div class="col-md-8">
      <div class="container border rounded p-3 border-2">
        <div class="row">
          <h3 class="text-center">Contract</h3>
        </div>
        <div class="row mb-3">
          <div class="form-group col-md-10">
            <h6 class="mb-2">Contract Address</h6>
            <input
              class="form-control"
              value={state.contractAddress}
              placeholder="Contract Address"
              onChange={(e) => cFunc(e, "address")}
            />
          </div>

          <div class="form-group col-md-2">
            <label></label>
            <button
              onClick={getMethodFromSource}
              class="btn btn-dark form-control "
            >
              🧙🏻 Scan
            </button>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-md-4">
            <h6>Method Name</h6>
            <input
              type="text"
              onChange={(e) => cFunc(e, "name")}
              class="form-control"
            />
          </div>
          <div class="form-group col-md-4">
            <h6>Label</h6>
            <input
              type="text"
              onChange={(e) => cFunc(e, "label")}
              class="form-control"
            />
          </div>
          <div class="form-group col-md-2">
            <h6>Action</h6>
            <select class="form-control" onChange={(e) => cFunc(e, "action")}>
              <option value="view" selected>
                View
              </option>
              <option value="call">Call</option>
            </select>
          </div>
          <div class="form-group col-md-2">
            <label></label>
            <button onClick={onCreateMethod} class="btn btn-dark form-control ">
              Create
            </button>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-md-12">
            {state.cMethod.length > 0 ? (
              <Widget src={`${cep}/widget/export-button`} props={state} />
            ) : (
              <>
                <label></label>
                <button class="btn btn-dark form-control ">🔼 Export</button>
              </>
            )}
          </div>
        </div>
        {state.cMerr && (
          <p class="text-danger" role="alert">
            {state.cMerr}
          </p>
        )}
      </div>
      <br />
      {state.cMethod &&
        state.cMethod.map((functions, fIndex) => (
          <div class="card mb-2">
            <div class="card-header">
              <div class="container">
                <div class="row">
                  <div class="col-sm-8 pt-2">
                    <h6>
                      {functions.name}
                      <span class="text-info">
                        {" - Custom Method/ Button Label/ Params"}
                      </span>
                    </h6>
                  </div>
                  <div class="col-sm-4 text-end pt-2">
                    <button
                      type="button"
                      onClick={(e) => cMLabel(e, fIndex, "remove")}
                      class="btn-close"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="container">
                <div class="row mb-3">
                  <div class="form-group col-md-8">
                    <div class="form-group row mb-2">
                      <h6 class="col-sm-4 col-form-label">Method Label</h6>
                      <div class="col-sm-6">
                        <input
                          placeholder="Method Label"
                          class="form-control"
                          defaultValue={functions.label || ""}
                          onChange={(e) => cMLabel(e, fIndex, "method")}
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <h6 class="col-sm-4 col-form-label">Button Label</h6>
                      <div class="col-sm-6">
                        <input
                          placeholder="Button Label"
                          class="form-control"
                          defaultValue={args.button || ""}
                          onChange={(e) => cMLabel(e, fIndex, "button")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-2">
                    <h6>Arguments</h6>
                  </div>
                  <div class="form-group col-md-2">
                    <h6>Label</h6>
                  </div>
                  <div class="form-group col-md-2">
                    <h6>Type</h6>
                  </div>
                  <div class="form-group col-md-2">
                    <button
                      class="btn btn-secondary btn-sm"
                      onClick={(e) => onCreateArgs(functions.name, fIndex)}
                    >
                      Add
                    </button>
                  </div>
                  <div class="form-group col-md-2">
                    <button
                      class="btn btn-secondary btn-sm"
                      onClick={(e) => getArgsFromMethod(functions.name, fIndex)}
                    >
                      Detect
                    </button>
                  </div>
                </div>
              </div>
              <br />
              {functions.params.args &&
                functions.params.args.map((args, argIndex) => {
                  return (
                    <div class="container pb-2">
                      <div class="row">
                        <div class="form-group col-md-2">
                          <input
                            placeholder="Name"
                            class="form-control"
                            defaultValue={args.name || ""}
                            onChange={(e) => cAD(e, fIndex, argIndex, "name")}
                          />
                        </div>
                        <div class="form-group col-md-2">
                          <input
                            placeholder="Label"
                            class="form-control"
                            defaultValue={args.label || ""}
                            onChange={(e) => cAD(e, fIndex, argIndex, "label")}
                          />
                        </div>
                        <div class="form-group col-md-2">
                          <select
                            defaultValue={args.type_schema.type}
                            class="form-control"
                            onChange={(e) => cAD(e, fIndex, argIndex, "type")}
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="json">Json</option>
                            <option value="array">Array</option>
                          </select>
                        </div>
                        <div class="form-group col-md-4">
                          <input
                            onChange={(e) => cAD(e, fIndex, argIndex, "value")}
                            class="form-control"
                            type="string"
                            placeholder="Argument value"
                          />
                        </div>
                        <div class="form-group col-md-2">
                          <button
                            type="button"
                            onClick={(e) => cAD(e, fIndex, argIndex, "remove")}
                            class="btn btn-danger btn-sm"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {functions.kind == "call" ? (
                <>
                  <div class="container pb-1 pt-3">
                    <div class="row">
                      <div class="form-group col-md-12">
                        <h6>Options</h6>
                      </div>
                    </div>
                  </div>
                  <div class="container">
                    <div class="row">
                      <div class="form-group col-md-6">
                        <label>Attached deposit</label>
                        <input
                          type="text"
                          defaultValue="0"
                          onChange={(e) => cMLabel(e, fIndex, "deposit")}
                          class="form-control"
                        />
                      </div>
                      <div class="form-group col-md-6">
                        <label>Gas</label>
                        <input
                          type="text"
                          defaultValue="30000000000000"
                          onChange={(e) => cMLabel(e, fIndex, "gas")}
                          class="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {state.res[functions.name] && state.res[functions.name] ? (
                <>
                  <div
                    className={
                      state.res[functions.name].error
                        ? "alert  alert-danger"
                        : "alert  alert-success"
                    }
                    role="alert"
                  >
                    {state.res[functions.name].value}
                  </div>
                </>
              ) : (
                ""
              )}
              <button
                class="btn btn-dark btn-sm mt-2"
                onClick={(e) =>
                  onBtnClickCall(functions.name, functions.kind, fIndex)
                }
              >
                {functions.kind == "view" ? "View" : "Call"}
              </button>
            </div>
          </div>
        ))}
    </div>
    <div class="col-md-4">
      {state.cMethod.length > 0 && (
        <Widget src={`${cep}/widget/preview`} props={state} />
      )}
    </div>
  </div>
);
