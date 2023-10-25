State.init({
  clientId: props.clientId ? props.clientId : null,
  clientName: props.clientName ? props.clientName : "",
  contractAddress: props.address ? props.address : "",
  cMethod: props.abi ? props.abi : [],
  rpcUrl: "https://rpc.near.org/",
  archivalRpc: "https://archival-rpc.mainnet.near.org",
  nearBlockRpc: "https://api.nearblocks.io/",
  fName,
  fAction: "view",
  fLabel,
  cMerr,
  res,
  cAerr,
  messProccses: "",
  totalProcess: 0,
  endprocess: 1,
});

const header = {
  "Content-Type": "application/json",
};
const saveClientConfig = {
  clientId: state.clientId,
  clientName: state.clientName,
  clientContract: state.contractAddress,
  abi: state.cMethod,
};
const opGet = {
  headers: header,
  method: "GET",
};
const asyncIntervals = [];

const runAsyncInterval = (cb, interval, intervalIndex) => {
  cb();
  if (asyncIntervals[intervalIndex].run) {
    asyncIntervals[intervalIndex].id = setTimeout(
      () => runAsyncInterval(cb, interval, intervalIndex),
      interval
    );
  }
};
const setAsyncInterval = (cb, interval) => {
  if (cb && typeof cb === "function") {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push({ run: true, id: id });
    runAsyncInterval(cb, interval, intervalIndex);
    return intervalIndex;
  } else {
    throw new Error("Callback must be a function");
  }
};
const clearAsyncInterval = (intervalIndex) => {
  if (asyncIntervals[intervalIndex].run) {
    clearTimeout(asyncIntervals[intervalIndex].id);
    asyncIntervals[intervalIndex].run = false;
    State.update({
      endprocess: state.endprocess++,
    });
  }
};
const updateContractAddress = (e) => {
  State.update({ contractAddress: data.toLowerCase() });
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
  if (type == "gas") a[fIdx].gas = parseInt(value) || 0;
  if (type == "deposit") a[fIdx].deposit = parseInt(value) || 0;
  if (type == "remove") a.splice(fIdx, 1);
  State.update({ cMethod: a });
};
const cAD = (e, fIdx, aIdx, type) => {
  const value = e.target.value;
  const a = state.cMethod;
  if (type == "name") a[fIdx].params.args[aIdx].name = value;
  if (type == "label") a[fIdx].params.args[aIdx].label = value;
  if (type == "type") a[fIdx].params.args[aIdx].type_schema.type = value;
  if (type == "value") {
    if (a[fIdx].params.args[aIdx].type_schema.type == "integer") {
      a[fIdx].params.args[aIdx].value = parseInt(value);
    }
    if (a[fIdx].params.args[aIdx].type_schema.type == "array") {
      a[fIdx].params.args[aIdx].value = value.split("|"); //check valid
    }
    if (a[fIdx].params.args[aIdx].type_schema.type == "boolean") {
      a[fIdx].params.args[aIdx].value = Boolean(value);
    }
    if (a[fIdx].params.args[aIdx].type_schema.type == "json") {
      a[fIdx].params.args[aIdx].value = JSON.parse(value); //check valid
    }
    if (a[fIdx].params.args[aIdx].type_schema.type == "string") {
      a[fIdx].params.args[aIdx].value = value; //check valid
    }
    if (a[fIdx].params.args[aIdx].type_schema.type == "enum") {
      a[fIdx].params.args[aIdx].value = value; //check valid
    }
    if (a[fIdx].params.args[aIdx].type_schema.type == "$ref") {
      a[fIdx].params.args[aIdx].value = value; //check account valid
    }
  }
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
  State.update({ cMerr: null });
  State.update({ totalProcess: 0 });
  State.update({ endprocess: 1 });
  let abiMethod = [];
  State.update({ cMethod: [] });
  const resb = res.body;
  if (resb.result.code_base64) {
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
          opGet
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

      State.update({ totalProcess: filterFunction.length });
    } else {
      State.update({ cMerr: "Unable to detect Method!" });
    }
  }
};
const getArgsFromMethod = (fName, fIndex) => {
  asyncFetch(
    `${state.nearBlockRpc}v1/account/${state.contractAddress}/txns?method=${fName}&order=desc&page=1&per_page=1`,
    opGet
  )
    .then((res) => {
      const restxns = res.body.txns[0];
      if (restxns.outcomes.status && restxns.logs.length > 0) {
        const argsData = JSON.parse(
          restxns.logs[0].replace("EVENT_JSON:", "").replaceAll("\\", "")
        );

        const args = argsData.data[0] || argsData;
        const abiMethod = state.cMethod;

        abiMethod[fIndex].params.args = [];
        if (Object.keys(args).length > 0) {
          Object.keys(args).forEach((item) => {
            const arg = {
              name: item,
              type_schema: {
                type:
                  typeof args[item] == "number"
                    ? "integer"
                    : typeof args[item] == "object"
                    ? "json"
                    : typeof args[item],
              },
              value: "",
            };
            abiMethod[fIndex].kind = "call";
            abiMethod[fIndex].params.args.push(arg);
            State.update({ cMethod: abiMethod });
          });
        }
        State.update({
          endprocess: state.endprocess++,
        });
      } else {
        let countLoop = 0;
        const getArg = setAsyncInterval(() => {
          const abiMethod = state.cMethod;
          const argsArr = abiMethod[fIndex].params.args;

          const argMap = argsArr.map(({ name, value }) => ({ [name]: value })); //bug

          const args = {};
          argMap.forEach((item) => {
            Object.assign(args, item);
          });

          asyncFetch(state.rpcUrl, {
            body: JSON.stringify({
              method: "query",
              params: {
                request_type: "call_function",
                account_id: state.contractAddress,
                method_name: fName,
                args_base64: new Buffer.from(JSON.stringify(args)).toString(
                  "base64"
                ),
                finality: "final",
              },
              id: 154,
              jsonrpc: "2.0",
            }),
            headers: header,
            method: "POST",
          }).then((res) => {
            const strErr = res.body.result.error;
            if (strErr && strErr.includes("missing field")) {
              const argName = strErr.substring(
                strErr.indexOf("`") + 1,
                strErr.lastIndexOf("`")
              );
              const checkType = [
                { value: "", type: "string" },
                { value: 0, type: "integer" },
                { value: [], type: "array" },
                { value: true, type: "boolean" },
                { value: {}, type: "json" },
                { value: state.contractAddress, type: "$ref" },
              ];
              const isCheck = false;

              checkType.forEach((typeItem) => {
                if (isCheck == false) {
                  asyncFetch(state.rpcUrl, {
                    body: JSON.stringify({
                      method: "query",
                      params: {
                        request_type: "call_function",
                        account_id: state.contractAddress,
                        method_name: fName,
                        args_base64: new Buffer.from(
                          JSON.stringify({
                            [argName]: typeItem.value,
                          })
                        ).toString("base64"),
                        finality: "final",
                      },
                      id: 154,
                      jsonrpc: "2.0",
                    }),
                    headers: header,
                    method: "POST",
                  }).then((res) => {
                    const isExist = false;

                    const uS = (argName, type, value) => {
                      const arg = {
                        name: argName,
                        type_schema: {
                          type: type,
                        },
                        value: type == "enum" ? value[0] : value,
                      };
                      if (type == "enum") {
                        arg.enum = value;
                      }

                      abiMethod[fIndex].params.args.forEach((item) => {
                        if (item.name == argName) {
                          isExist = true;
                        }
                      });
                      if (isExist == false) {
                        abiMethod[fIndex].params.args.push(arg);
                        State.update({ cMethod: abiMethod });
                      }
                      if (isCheck && isExist) {
                        //  clearInterval(getArg);
                      }
                      isCheck = true;
                    };
                    if (res.body.result.result) {
                      clearAsyncInterval(getArg);
                    }
                    const ftch = res.body.result.error;

                    if (ftch) {
                      if (ftch.includes("Option::unwrap()`")) {
                        uS(argName, typeItem.type, typeItem.value);
                        abiMethod[fIndex].kind = "call";
                        State.update({ cMethod: abiMethod });
                        clearAsyncInterval(getArg);
                      }
                      if (ftch.includes("the account ID")) {
                        uS(argName, "$ref", state.contractAddress);
                      }

                      if (
                        ftch.includes("invalid type: sequence, expected u64")
                      ) {
                        uS(argName, "number", 300);
                      }
                      if (ftch.includes("invalid digit found")) {
                        uS(argName, "string", "300");
                      }
                      if (
                        ftch.includes(
                          "invalid type: sequence, expected a string"
                        )
                      ) {
                        if (isExist) {
                          uS(argName, "string", "wrap.near");
                        } else {
                          uS(argName, "string", "30");
                        }
                        // clearInterval(getArg);
                      }
                      if (
                        ftch.includes(
                          "data did not match any variant of untagged enum"
                        )
                      ) {
                        uS(argName, typeItem.type, ["300", "300"]);
                        clearAsyncInterval(getArg);
                      }

                      if (ftch.includes("not implemented")) {
                        uS(argName, typeItem.type, ["300", "300"]);
                        // clearInterval(getArg);
                      }
                      if (ftch.includes("invalid token id")) {
                        uS(argName, "$ref", "wrap.near");
                      }
                      if (ftch.includes("integer from empty string")) {
                        uS(argName, typeItem.type, "300");
                      }
                      if (ftch.includes("unknown variant")) {
                        isCheck = true;
                        const getEnum = ftch.match(/\`(.*?)\`/g);

                        const enumList = [];
                        getEnum.forEach((item, index) => {
                          if (index !== 0) {
                            enumList.push(item.replaceAll("`", ""));
                          }
                        });
                        uS(argName, "enum", enumList);
                      }
                      if (ftch.includes("missing field")) {
                        uS(argName, typeItem.type, typeItem.value);
                      }

                      if (ftch.includes("attached deposit")) {
                        uS(argName, typeItem.type, typeItem.value);
                        abiMethod[fIndex].kind = "call";
                        abiMethod[fIndex].deposit = parseInt(
                          strErr.match(/\d+/)[0]
                        );
                        State.update({ cMethod: abiMethod });
                        clearAsyncInterval(getArg);
                      }
                    } else {
                      uS(argName, typeItem.type, typeItem.value);
                      clearAsyncInterval(getArg);
                    }
                  });
                }
              });
            }
            if (res.body.result.result) {
              clearAsyncInterval(getArg);
            }

            if (strErr) {
              if (strErr.includes("Invalid register")) {
                abiMethod[fIndex].kind = "call";
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }
              if (strErr.includes("not implemented")) {
                clearAsyncInterval(getArg);
              }
              if (strErr.includes("Option::unwrap()`")) {
                abiMethod[fIndex].kind = "call";
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }
              if (strErr.includes("been initialized")) {
                abiMethod[fIndex].kind = "call";
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }
              if (strErr.includes("No token")) {
                abiMethod[fIndex].kind = "call";
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }
              if (strErr.includes("MethodNotFound")) {
                clearAsyncInterval(getArg);
              }
              if (
                strErr.includes("storage_write") ||
                strErr.includes("predecessor_account_id")
              ) {
                abiMethod[fIndex].kind = "call";
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }
              if (strErr.includes("attached deposit")) {
                abiMethod[fIndex].kind = "call";
                abiMethod[fIndex].deposit = parseInt(strErr.match(/\d+/)[0]);
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }

              if (strErr.includes("assertion failed: `(left == right)")) {
                abiMethod[fIndex].kind = "call";
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }
              if (strErr.includes("valid type: sequence, expected u64")) {
                abiMethod[fIndex].params.arg = 0;
                State.update({ cMethod: abiMethod });
                clearAsyncInterval(getArg);
              }
            }
          });
          countLoop++;
          if (countLoop == 20) {
            clearAsyncInterval(getArg);
          }

          State.update({
            messProccses: `Scanning Method : "${fName}"`,
          });
        }, 1000);
      }
    })
    .catch((err) => {
      if (err) {
        State.update({
          endprocess: state.endprocess++,
        });
      }
    });
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
        abiMethod[fIndex].gas,
        abiMethod[fIndex].deposit
      );
    }
  }
};
return (
  <>
    <div class="container border rounded p-3 border-2">
      <h3 class="text-center">Contract</h3>
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
            disabled={(state.endprocess / state.totalProcess) * 100 < 100}
          >
            🧙🏻 Scan
          </button>
        </div>
      </div>
      {state.totalProcess > 0 && (
        <div class="row">
          <div class="form-group col-md-12">
            <div class="progress">
              <div
                className={`progress-bar progress-bar-striped ${
                  state.totalProcess > 0 &&
                  (state.endprocess / state.totalProcess) * 100 < 100
                    ? "progress-bar-animated"
                    : "bg-success"
                }  ${
                  (state.endprocess / state.totalProcess) * 100 == 100
                    ? "bg-success"
                    : ""
                }`}
                role="progressbar"
                aria-valuenow="75"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{
                  width: `${(state.endprocess / state.totalProcess) * 100}%`,
                }}
              >
                {Math.round((state.endprocess / state.totalProcess) * 100) ==
                100
                  ? "Scan completed"
                  : state.messProccses}
                {Math.round((state.endprocess / state.totalProcess) * 100)} % -
                ({state.endprocess < 0 ? 0 : state.endprocess}/
                {state.totalProcess})
              </div>
            </div>
          </div>
        </div>
      )}

      <div class="row">
        <div class="form-group col-md-4">
          {state.cMethod.length > 0 ? (
            <Widget src={`${cep}/widget/export-button`} props={state} />
          ) : (
            <>
              <label></label>
              <button class="btn btn-primary form-control ">🔼 Export</button>
            </>
          )}
        </div>
        <div class="form-group col-md-4">
          {state.cMethod.length > 0 ? (
            <Widget src={`${cep}/widget/preview-button`} props={state} />
          ) : (
            <>
              <label></label>
              <button class="btn btn-primary form-control ">👀 Preview</button>
            </>
          )}
        </div>
        <div class="form-group col-md-4">
          {state.cMethod.length > 0 ? (
            <Widget
              src={`${cep}/widget/save-client-button`}
              props={saveClientConfig}
            />
          ) : (
            <>
              <label></label>
              <button class="btn btn-primary form-control ">
                {" "}
                Save Client
              </button>
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
    <div class="row mb-4">
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
        <button onClick={onCreateMethod} class="btn btn-primary form-control ">
          Create
        </button>
      </div>
    </div>
    {state.cMethod &&
      state.cMethod.map((functions, fIndex) => (
        <div class="card mt-2">
          <div class="card-header">
            <div class="container">
              <div class="row">
                <div class="col-sm-8 pt-2">
                  <h6>
                    {functions.name}
                    <span class="text-info">
                      {"[Custom-Method-Params-Label-Button-Style]"}
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
            <div class="container mb-3">
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
                          <option value="integer">Number</option>
                          <option value="enum">Enum</option>
                          <option value="boolean">Boolean</option>
                          <option value="json">Json</option>
                          <option value="array">Array</option>
                          <option value="$ref">AccountID</option>
                        </select>
                      </div>
                      <div class="form-group col-md-4">
                        {args.type_schema.type == "string" ||
                        args.type_schema.type == "$ref" ||
                        args.type_schema.type == "integer" ||
                        args.type_schema.type == "json" ||
                        args.type_schema.type == "array" ? (
                          <input
                            onChange={(e) => cAD(e, fIndex, argIndex, "value")}
                            class="form-control"
                            type="string"
                            placeholder="Argument value"
                          />
                        ) : (
                          ""
                        )}
                        {args.type_schema.type == "boolean" ? (
                          <select
                            defaultValue={args.type_schema.type}
                            class="form-control"
                            onChange={(e) => cAD(e, fIndex, argIndex, "value")}
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : (
                          ""
                        )}
                        {args.type_schema.type == "enum" ? (
                          <select
                            defaultValue={args.type_schema.type}
                            class="form-control"
                            onChange={(e) => cAD(e, fIndex, argIndex, "value")}
                          >
                            {args.enum &&
                              args.enum.map((item, i) => (
                                <option value={item}>{item}</option>
                              ))}
                          </select>
                        ) : (
                          ""
                        )}
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
                        defaultValue={"" + functions.deposit}
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
              <div
                className={
                  state.res[functions.name].error
                    ? "alert  alert-danger"
                    : "alert  alert-success"
                }
                role="alert"
              >
                <pre>
                  {JSON.stringify(
                    JSON.parse(state.res[functions.name].value),
                    null,
                    2
                  )}
                </pre>
                <button
                  class="btn btn-dark btn-sm mt-2"
                  onClick={() => {
                    clipboard.writeText(state.res[functions.name].value);
                  }}
                >
                  Copy
                </button>
              </div>
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
  </>
);
