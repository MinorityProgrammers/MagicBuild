State.init({
  clientId: props.clientId ? props.clientId : null,
  clientName: props.clientName ? props.clientName : "",
  contractAddress: props.address ? props.address : "",
  cMethod: props.abi ? props.abi : [],
  rpcUrl: "https://rpc.near.org/",
  archivalRpc: "https://archival-rpc.mainnet.near.org",
  nearBlockRpc: "https://api.nearblocks.io/",
  fName: "",
  fAction: "view",
  fLabel: "",
  cMerr,
  res,
  cAerr,
  messProccses: "",
  totalProcess: 0,
  endprocess: 1,
  designMode: false,
  cssStyle: "",
  prompt,
  promptLoading: false,
  openModalCSS: false,
  openModalPreview: false,
  clickedModalCSS: false,
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

const cFunc = (e, type) => {
  const data = e.target.value;
  if (type == "name") State.update({ fName: data });
  if (type == "label") State.update({ fLabel: data });
  if (type == "action") State.update({ fAction: data });
  if (type == "address") State.update({ contractAddress: data.toLowerCase() });
};
const cep = "magicbuild.near";
const onCreateArgs = (fName) => {
  State.update({ cAerr: { [fName]: null } });
  const arg = {
    name: "",
    label: "",
    button: "",
    className: "",
    classButton: "",
    type_schema: {
      type: "string",
    },
    value: "",
  };
  const abiMethod = state.cMethod;
  abiMethod.forEach((item, index) => {
    if (item.name == fName && item.kind) {
      abiMethod[index].params.args.push(arg);
      State.update({ cMethod: abiMethod });
    }
  });
};
const onSwitchChangeDesignMode = () => {
  State.update({ designMode: !state.designMode });
};
const cMLabel = (e, functions, type) => {
  const value = e.target.value;
  const a = state.cMethod;
  a.forEach((item, fIdx) => {
    if (functions.name == item.name && item.kind) {
      if (type == "method") a[fIdx].label = value;
      if (type == "className") a[fIdx].className = value;
      if (type == "classButton") a[fIdx].classButton = value;
      if (type == "labelDeposit") a[fIdx].labelDeposit = value;
      if (type == "button") a[fIdx].button = value;
      if (type == "gas") a[fIdx].gas = value || 0;
      if (type == "deposit") a[fIdx].deposit = value || 0;
      if (type == "remove") a.splice(fIdx, 1);
      if (type == "depositUnit") a[fIdx].depositUnit = value;
      if (type == "gasUnit") a[fIdx].gasUnit = value;
      if (type == "selfInputDeposit")
        a[fIdx].selfInputDeposit = e.target.checked;
      State.update({ cMethod: a });
    }
  });
};
const cAD = (e, functions, aIdx, type) => {
  const value = e.target.value;
  const a = state.cMethod;
  a.forEach((item, fIdx) => {
    if (functions.name == item.name && item.kind) {
      console.log("a", a[fIdx].params.args[aIdx]);
      if (type == "name") a[fIdx].params.args[aIdx].name = value;
      if (type == "label") a[fIdx].params.args[aIdx].label = value;
      if (type == "className") a[fIdx].params.args[aIdx].className = value;
      if (type == "type") a[fIdx].params.args[aIdx].type_schema.type = value;
      if (type == "value") {
        if (a[fIdx].params.args[aIdx].type_schema.type == "integer") {
          a[fIdx].params.args[aIdx].value = parseInt(value);
        }
        if (a[fIdx].params.args[aIdx].type_schema.type == "array") {
          a[fIdx].params.args[aIdx].value = value.split("|");
        }
        if (a[fIdx].params.args[aIdx].type_schema.type == "boolean") {
          a[fIdx].params.args[aIdx].value = Boolean(value);
        }
        if (a[fIdx].params.args[aIdx].type_schema.type == "json") {
          a[fIdx].params.args[aIdx].value = JSON.parse(value);
        }
        if (a[fIdx].params.args[aIdx].type_schema.type == "string") {
          a[fIdx].params.args[aIdx].value = value;
        }
        if (a[fIdx].params.args[aIdx].type_schema.type == "enum") {
          a[fIdx].params.args[aIdx].value = value;
        }
        if (a[fIdx].params.args[aIdx].type_schema.type == "$ref") {
          a[fIdx].params.args[aIdx].value = value;
        }
      }
      if (type == "remove") a[fIdx].params.args.splice(aIdx, 1);
      State.update({ cMethod: a });
    }
  });
};
const onSwitchChangeArgExport = (fIndex) => {
  const abiMethod = state.cMethod;
  abiMethod[fIndex].export = !abiMethod[fIndex].export;
  State.update({ cMethod: abiMethod });
};
const selectAll = () => {
  const abiMethod = state.cMethod;
  abiMethod.forEach((item, index) => {
    abiMethod[index].export = true;
  });
  State.update({ cMethod: abiMethod });
};
const closeAll = () => {
  const abiMethod = state.cMethod;
  abiMethod.forEach((item, index) => {
    abiMethod[index].export = false;
  });
  State.update({ cMethod: abiMethod });
};
const cPrompt = (e) => {
  State.update({ prompt: e.target.value });
};
const promptLoadingUI = (
  <span
    className="spinner-grow spinner-grow-sm me-1"
    role="status"
    aria-hidden="true"
  />
);

const getPrompt = () => {
  State.update({ promptLoading: true });
  asyncFetch("https://api.openai.com/v1/chat/completions", {
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Act as a UI developer, users will fill out a prompt about their frontend ideas, and your role is to create a css style. To describe the projects, It is the card that has a title as .card-header, inside has label{}, input{} and 1 Button. Select a different color background that matches the user's theme. Find the color of the label, input, button that is complementary to the background. Create button effects. Don't fix the width of the card, the card-header text aligns in the center, bold and the font size is 40, and the label and button font size 30. User prompt:{"${state.prompt}"}. Answer as the Following format: .card{} .card-header button{} input{} label{} and no more explaination`,
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
    State.update({ promptLoading: false });
    State.update({ cssStyle: res.body.choices[0].message.content });
    State.update({ openModalPreview: true });
  });
};
const openModalCSS = (e, type) => {
  if (type == "show") {
    State.update({ openModalCSS: true, clickedModalCSS: false });
  }
  if (type == "close") {
    State.update({ openModalCSS: false });
  }
};
const openModalPreview = (type) => {
  if (type == "show") {
    State.update({ openModalPreview: true });
  }
  if (type == "close") {
    State.update({ openModalPreview: false });
  }
};
const onCreateMethod = () => {
  if (state.fName.length > 0) {
    State.update({ cMerr: null });
    const method = {
      name: state.fName,
      kind: state.fAction,
      label: state.fLabel,
      button: "",
      className: "",
      classButton: "",
      labelDeposit: "",
      export: true,
      params: {
        serialization_type: "json",
        args: [],
      },
      deposit: 0,
      depositUnit: "near",
      selfInputDeposit: false,
      gas: 30000000000000,
      gasUnit: "yoctoNEAR",
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
          label: "",
          button: "",
          className: "",
          classButton: "",
          labelDeposit: "",
          export: true,
          params: {
            serialization_type: "json",
            args: [],
          },
          deposit: 0,
          gas: 30000000000000,
          deposit: 0,
          depositUnit: "near",
          selfInputDeposit: false,
          gas: 30000000000000,
          gasUnit: "yoctoNEAR",
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
          const argMap = argsArr.map(({ name, value }) => ({ [name]: value }));
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
const cCSS = (e) => {
  State.update({ cssStyle: e.target.value });
};

const onBtnClickCall = (functions, action) => {
  const argMap = functions.params.args.map(({ name, value }) => ({
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
          method_name: functions.name,
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
            [functions.name]: { value: result, error: false },
          },
        });
      }
      if (resb.error) {
        const error = resb.error;
        State.update({
          res: {
            [functions.name]: { value: error, error: true },
          },
        });
      }
    });
  }
  if (action === "call") {
    if (functions.deposit == 0 && functions.gas == 30000000000000) {
      Near.call(state.contractAddress, functions.name, args);
    }
    if (functions.deposit > 0 || functions.gas > 30000000000000) {
      Near.call(
        state.contractAddress,
        functions.name,
        args,
        functions.gasUnit == "near"
          ? functions.gas * Math.pow(10, 24)
          : functions.gas,
        functions.depositUnit == "near"
          ? functions.deposit * Math.pow(10, 24)
          : functions.deposit
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
        <div class="form-group col-md-3">
          <label></label>
          <button
            class="btn btn-primary form-control "
            data-bs-toggle="modal"
            data-bs-target={`#show-method`}
            class="btn btn-primary form-control "
          >
            Filter
          </button>
          <div
            class="modal fade"
            id={`show-method`}
            tabindex="-2"
            aria-labelledby="showLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="showLabel">
                    Choose Method to Show
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  {state.cMethod &&
                    state.cMethod
                      .filter((functions) => functions.kind)
                      .map((functions, fIndex) => (
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={functions.export}
                            onChange={() => onSwitchChangeArgExport(fIndex)}
                          />
                          <label
                            class="form-check-label"
                            for={`flexSwitcFilter${fIndex}`}
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

                  <button
                    type="button"
                    disabled={state.clicked}
                    onClick={closeAll}
                    class="btn btn-primary"
                  >
                    Close all
                  </button>
                  <button
                    type="button"
                    disabled={state.clicked}
                    onClick={selectAll}
                    class="btn btn-success"
                  >
                    Select all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group col-md-3">
          {state.cMethod.length > 0 ? (
            <Widget
              src={`${cep}/widget/save-client-button`}
              props={saveClientConfig}
            />
          ) : (
            <>
              <label></label>
              <button class="btn btn-primary form-control ">
                ➕ Save Client
              </button>
            </>
          )}
        </div>

        <div class="form-group col-md-3">
          {state.cMethod && state.cMethod.length > 0 ? (
            <Widget
              src={`${cep}/widget/preview-button`}
              props={{
                contractAddress: state.contractAddress,
                cMethod: state.cMethod,
                cssStyle: state.cssStyle,
              }}
            />
          ) : (
            <>
              <label></label>
              <button class="btn btn-primary form-control ">👀 Preview</button>
            </>
          )}
        </div>
        <div class="form-group col-md-3">
          {state && state.cMethod.length > 0 ? (
            <Widget src={`${cep}/widget/export-button`} props={state} />
          ) : (
            <>
              <label></label>
              <button class="btn btn-primary form-control ">🔼 Export</button>
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
      <div class="form-group col-md-2">
        <div class="form-check form-switch">
          <label class="form-check-label" for="flexSwitchCheckDesginMode">
            Design
          </label>
          <input
            checked={state.designMode}
            role="switch"
            onChange={onSwitchChangeDesignMode}
            class="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDesginMode"
          />
        </div>
      </div>
    </div>

    {state.designMode && (
      <div class="container border rounded p-3 border-2 mb-3">
        <div class="row ">
          <div class="form-group col-md-9 ">
            <h6 class="mb-2">Type your prompt : </h6>
            <input
              class="form-control"
              value={state.prompt}
              placeholder="I want to create a modern style Christmas vibe frontend with gradient background"
              onChange={(e) => cPrompt(e)}
            />
          </div>
          <div class="form-group col-md-3">
            <label></label>
            <button
              disabled={state.promptLoading}
              onClick={getPrompt}
              class="btn btn-success form-control "
            >
              {state.promptLoading ? promptLoadingUI : "🪄"} Magic Style
            </button>
            {state.openModalCSS && (
              <>
                <div
                  style={{ display: "block" }}
                  className={`modal fade show`}
                  id="showCSS"
                  tabindex="-1"
                  aria-labelledby="showCSSLabel"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="showCSSLabel">
                          CSS View
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          onClick={(e) => openModalCSS(e, "close")}
                        ></button>
                      </div>
                      <div class="modal-body">
                        <textarea
                          style={{ height: "500px" }}
                          class="form-control"
                          value={state.cssStyle}
                          onChange={(e) => cCSS(e)}
                        ></textarea>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          onClick={(e) => openModalCSS(e, "close")}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            openModalCSS(e, "close");
                          }}
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
            {state.openModalPreview && state.cMethod.length > 0 && (
              <>
                <div
                  style={{ display: "block" }}
                  className={`modal fade show`}
                  id="openModalPreview"
                  tabindex="-1"
                  aria-labelledby="openModalPreviewLabel"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="showCSSLabel">
                          Frontend Preview
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          onClick={(e) => openModalPreview("close")}
                        ></button>
                      </div>
                      <div class="modal-body">
                        {state.cMethod.length > 0 && (
                          <Widget src={`${cep}/widget/preview`} props={state} />
                        )}
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          onClick={(e) => openModalPreview("close")}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            openModalPreview("close");
                          }}
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
        <div class="row">
          <div class="form-group col-md-4"></div>
          <div class="form-group col-md-4">
            <label></label>
            <button
              class="btn btn-primary form-control "
              onClick={(e) => {
                openModalCSS(e, "show");
              }}
            >
              Custom CSS
            </button>
          </div>
          <div class="form-group col-md-4"></div>
        </div>
      </div>
    )}
    {!state.designMode && (
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
          <button
            onClick={onCreateMethod}
            class="btn btn-primary form-control "
          >
            Create
          </button>
        </div>
      </div>
    )}

    {state.cMethod &&
      state.cMethod
        .filter((functions) => functions.export == true)
        .map((functions, fIndex) => (
          <div class="card mt-2">
            <div class="card-header">
              <div class="container">
                <div class="row">
                  <div class="col-sm-8 pt-3">
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
                      onClick={(e) => cMLabel(e, functions, "remove")}
                      class="btn-close"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="container mb-3">
                <div class="row mb-3">
                  {state.designMode && (
                    <div class="form-group col-md-8">
                      <div class="form-group row mb-2">
                        <h6 class="col-sm-4 col-form-label">Method Label</h6>
                        <div class="col-sm-6">
                          <input
                            placeholder="Method Label"
                            class="form-control"
                            defaultValue={functions.label || ""}
                            onChange={(e) => cMLabel(e, functions, "method")}
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <h6 class="col-sm-4 col-form-label">Method Class</h6>
                        <div class="col-sm-6">
                          <input
                            placeholder="Boostrap Class"
                            class="form-control"
                            defaultValue={functions.className || ""}
                            onChange={(e) => cMLabel(e, functions, "className")}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {state.designMode && <hr />}
                <div class="row">
                  <div
                    className={`form-group col-md-${
                      state.designMode ? "2" : "4"
                    }`}
                  >
                    <h6>Arguments</h6>
                  </div>
                  <div class="form-group col-md-2">
                    <h6>Type</h6>
                  </div>
                  <div
                    className={`form-group col-md-${
                      state.designMode ? "3" : "3"
                    }`}
                  >
                    <h6>Value</h6>
                  </div>
                  {state.designMode && (
                    <div class="form-group col-md-2">
                      <h6>Label</h6>
                    </div>
                  )}

                  <div class="form-group col-md-1">
                    <button
                      class="btn btn-secondary btn-sm"
                      onClick={(e) => onCreateArgs(functions.name)}
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
                        <div
                          className={`form-group col-md-${
                            state.designMode ? "2" : "4"
                          }`}
                        >
                          <input
                            placeholder="Name"
                            class="form-control"
                            defaultValue={args.name || ""}
                            value={args.name || ""}
                            onChange={(e) =>
                              cAD(e, functions, argIndex, "name")
                            }
                          />
                        </div>

                        <div class="form-group col-md-2">
                          <select
                            value={args.type_schema.type}
                            defaultValue={args.type_schema.type}
                            class="form-control"
                            onChange={(e) =>
                              cAD(e, functions, argIndex, "type")
                            }
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
                        <div
                          className={`form-group col-md-${
                            state.designMode ? "3" : "4"
                          }`}
                        >
                          {args.type_schema.type == "string" ||
                          args.type_schema.type == "$ref" ||
                          args.type_schema.type == "integer" ||
                          args.type_schema.type == "json" ||
                          args.type_schema.type == "array" ? (
                            <input
                              onChange={(e) =>
                                cAD(e, functions, argIndex, "value")
                              }
                              class="form-control"
                              type="string"
                              placeholder="Argument value"
                            />
                          ) : (
                            ""
                          )}
                          {args.type_schema.type == "boolean" ? (
                            <select
                              value={args.value}
                              defaultValue={args.value}
                              class="form-control"
                              onChange={(e) =>
                                cAD(e, functions, argIndex, "value")
                              }
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : (
                            ""
                          )}
                          {args.type_schema.type == "enum" ? (
                            <select
                              value={args.value}
                              defaultValue={args.value}
                              class="form-control"
                              onChange={(e) =>
                                cAD(e, functions, argIndex, "value")
                              }
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
                        {state.designMode && (
                          <>
                            <div class="form-group col-md-2">
                              <input
                                placeholder="Label"
                                class="form-control"
                                value={args.label}
                                defaultValue={args.label || ""}
                                onChange={(e) =>
                                  cAD(e, functions, argIndex, "label")
                                }
                              />
                            </div>
                            <div class="form-group col-md-2">
                              <input
                                placeholder="Boostrap Class"
                                class="form-control"
                                value={args.className}
                                defaultValue={args.className || ""}
                                onChange={(e) =>
                                  cAD(e, functions, argIndex, "className")
                                }
                              />
                            </div>
                          </>
                        )}

                        <div class="form-group col-md-1">
                          <button
                            type="button"
                            onClick={(e) =>
                              cAD(e, functions, argIndex, "remove")
                            }
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
                    <hr />
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
                        <div class="input-group mb-3">
                          <input
                            type="number"
                            min="0"
                            value={"" + functions.deposit.toString()}
                            defaultValue={"" + functions.deposit.toString()}
                            onChange={(e) => cMLabel(e, functions, "deposit")}
                            class="form-control "
                          />
                          <select
                            class="form-select"
                            value={functions.depositUnit}
                            defaultValue={functions.depositUnit}
                            onChange={(e) =>
                              cMLabel(e, functions, "depositUnit")
                            }
                          >
                            <option value="near">Near</option>
                            <option value="yoctoNEAR">yoctoNEAR</option>
                          </select>
                        </div>

                        {state.designMode && (
                          <>
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                checked={functions.selfInputDeposit}
                                onChange={(e) =>
                                  cMLabel(e, functions, "selfInputDeposit")
                                }
                                id={`flexCheckDefault-${functions.name}`}
                              />
                              <label
                                class="form-check-label"
                                for={`flexCheckDefault-${functions.name}`}
                              >
                                Self-Input
                              </label>
                            </div>

                            <div class="input-group mb-3">
                              <span
                                class="input-group-text"
                                id={`label-deposit-${functions.name}`}
                              >
                                Label Deposit
                              </span>
                              <input
                                type="text"
                                class="form-control"
                                value={functions.labelDeposit}
                                defaultValue={functions.labelDeposit}
                                placeholder="Label Deposit"
                                aria-label="Label Deposit"
                                onChange={(e) =>
                                  cMLabel(e, functions, "labelDeposit")
                                }
                                aria-describedby={`label-deposit-${functions.name}`}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div class="form-group col-md-6">
                        <label>Gas</label>
                        <div class="input-group mb-3">
                          <input
                            type="number"
                            min="0"
                            value={"" + functions.gas}
                            defaultValue={"" + functions.gas}
                            onChange={(e) => cMLabel(e, functions, "gas")}
                            class="form-control"
                          />
                        </div>
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
              <div class="container pt-3">
                <div class="row">
                  <div class="form-group col-md-2">
                    <h6>Button</h6>
                  </div>
                  {state.designMode && (
                    <>
                      <div class="form-group col-md-4">
                        <h6>Button Label </h6>
                      </div>
                      <div class="form-group col-md-4">
                        <h6>Button Class</h6>
                      </div>
                    </>
                  )}
                  <div class="form-group col-md-2"></div>
                </div>
              </div>
              <div class="container pb-2">
                <div class="row">
                  <div class="form-group col-md-2">
                    <button
                      class="btn btn-primary "
                      onClick={(e) => onBtnClickCall(functions, functions.kind)}
                    >
                      {functions.kind == "view" ? "View" : "Call"}
                    </button>
                  </div>
                  {state.designMode && (
                    <>
                      <div class="form-group col-md-4">
                        <input
                          placeholder="Button Label"
                          class="form-control"
                          defaultValue={functions.button || ""}
                          onChange={(e) => cMLabel(e, functions, "button")}
                        />
                      </div>
                      <div class="form-group col-md-4">
                        <input
                          placeholder="Boostrap Class"
                          class="form-control"
                          defaultValue={functions.classButton || ""}
                          onChange={(e) => cMLabel(e, functions, "classButton")}
                        />
                      </div>
                    </>
                  )}

                  <div class="form-group col-md-2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
  </>
);
