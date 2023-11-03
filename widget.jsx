State.init({
  contractAddress: props.address,
  contractAbi: props,
  contractError,
  contractAbiCall,
  contractAbiView,
  response,
  contractAbiArg: [],
});

const onInputChangeContractArg = (obj) => {
  const data = state.contractAbiArg;
  const isExist = false;
  const indexData = null;

  data.forEach((item, index) => {
    if (item.functions == obj.functions && item.name == obj.name) {
      isExist = true;
      indexData = index;
    }
  });

  if (isExist) {
    data[indexData].value = obj.value;
  } else {
    data.push(obj);
  }

  State.update({ contractAbiArg: data });
};
const cDeposit = (e, fIndex) => {
  const data = state.contractAbiCall;
  data[fIndex].deposit = e.target.value;
  State.update({ contractAbiArg: data });
};
const onBtnClickCall = (e, fName, action, fIndex) => {
  const argsArr = [];
  const data = state.contractAbiArg;
  data.forEach((item) => {
    if (item.functions == fName) {
      if (item.type == "number" || item.type == "integer") {
        item.value = parseInt(item.value);
      }
      if (item.type == "array") {
        item.value = item.value.split("|");
      }
      if (item.type == "json") {
        item.value = JSON.parse(item.value);
      }
      if (item.type == "boolean") {
        item.value = Boolean(item.value);
      }
      argsArr.push(item);
    }
  });

  const argMap = argsArr.map(({ name, value }) => ({ [name]: value }));
  const args = {};
  argMap.forEach((item) => {
    Object.assign(args, item);
  });
  if (action == "view") {
    asyncFetch("https://rpc.near.org/", {
      body: JSON.stringify({
        method: "query",
        params: {
          request_type: "call_function",
          account_id: state.contractAddress,
          method_name: fName,
          args_base64: new Buffer.from(JSON.stringify(args)).toString("base64"),
          finality: "final",
        },
        id: 154,
        jsonrpc: "2.0",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((res) => {
      if (res.body.result.result) {
        const result = new Buffer.from(res.body.result.result).toString();
        State.update({
          response: {
            [fName]: { value: result, error: false },
          },
        });
      }
      if (res.body.result.error) {
        const error = res.body.result.error;
        State.update({
          response: {
            [fName]: { value: error, error: true },
          },
        });
      }
    });
  }
  if (action == "call") {
    const abiCall = state.contractAbiCall;
    Near.call(state.contractAddress, fName, args);
    if (abiCall[fIndex].deposit == 0 && abiCall[fIndex].gas == 30000000000000) {
      Near.call(state.contractAddress, abiCall[fIndex].name, args);
    }
    if (abiCall[fIndex].deposit > 0 || abiCall[fIndex].gas > 30000000000000) {
      Near.call(
        state.contractAddress,
        abiCall[fIndex].name,
        args,
        abiCall[fIndex].gasUnit == "near"
          ? abiCall[fIndex].gas * Math.pow(10, 24)
          : abiCall[fIndex].gas,
        abiCall[fIndex].depositUnit == "near"
          ? abiCall[fIndex].deposit * Math.pow(10, 24)
          : abiCall[fIndex].deposit
      );
    }
  }
};

const loadData = () => {
  const abi = state.contractAbi;
  if (abi.body.functions) {
    const contractCall = [];
    const contractView = [];
    abi.body.functions.forEach((item) => {
      if (item.kind == "call") {
        contractCall.push(item);
      }
      if (item.kind == "view") {
        contractView.push(item);
      }
      State.update({ contractAbiCall: contractCall });
      State.update({ contractAbiView: contractView });
    });
    State.update({ contractError: null });
  } else {
    State.update({ contractError: "Can not parse ABI" });
  }
};
loadData();

const notLoggedInWarning = <p class="text-center py-2"> Login to Use BOS </p>;
const Wrapper = styled.div`
 ${props.cssStyle}
`;
return (
  <>
    <div class="container">
      {context.accountId ? contractForm : notLoggedInWarning}
      <h3 class="text-center">
        Address:
        <span class="text-decoration-underline"> {state.contractAddress} </span>
      </h3>
      {state.contractError}
      {state.contractAbiView &&
        state.contractAbiView.map((functions) => (
          <div className={`card mb-2 ${functions.className}`}>
            <div class="card-header">
              {functions.label.length > 0 ? functions.label : functions.name}
            </div>
            <div class="card-body">
              {functions.params.args &&
                functions.params.args.map((args) => {
                  return (
                    <div className={`form-group pb-2 ${args.className}`}>
                      <label>
                        {args.label.length > 0 ? args.label : args.name}
                      </label>
                      {args.type_schema.type == "string" ||
                      args.type_schema.type == "$ref" ||
                      args.type_schema.type == "integer" ||
                      args.type_schema.type == "json" ||
                      args.type_schema.type == "array" ? (
                        <input
                          class="form-control"
                          data-name={args.name}
                          data-type={
                            args.type_schema.type == "string" ||
                            args.type_schema.type[0] == "string"
                              ? "text"
                              : args.type_schema.type == "integer" ||
                                args.type_schema.type[0] == "integer"
                              ? "number"
                              : args.type_schema.type == "array"
                              ? "array"
                              : args.type_schema.$ref
                              ? "text"
                              : "text"
                          }
                          type={"string"}
                          placeholder={
                            args.type_schema.type == "string" ||
                            args.type_schema.type[0] == "string"
                              ? "string"
                              : args.type_schema.type == "integer" ||
                                args.type_schema.type[0] == "integer"
                              ? "number"
                              : args.type_schema.type == "array"
                              ? "array : a|b"
                              : args.type_schema.type == "json"
                              ? "json : { }"
                              : args.type_schema.$ref
                              ? "Account Address"
                              : "text"
                          }
                          onChange={(e) =>
                            onInputChangeContractArg({
                              functions: functions.name,
                              name: args.name,
                              type:
                                args.type_schema.type == "string" ||
                                args.type_schema.type[0] == "string"
                                  ? "text"
                                  : args.type_schema.type == "integer" ||
                                    args.type_schema.type[0] == "integer"
                                  ? "number"
                                  : args.type_schema.type == "array"
                                  ? "array"
                                  : args.type_schema.type == "json"
                                  ? "json"
                                  : args.type_schema.$ref
                                  ? "text"
                                  : "text",
                              value: e.target.value,
                            })
                          }
                        />
                      ) : (
                        ""
                      )}
                      {args.type_schema.type == "boolean" ? (
                        <select
                          defaultValue={args.type_schema.type}
                          class="form-control"
                          onChange={(e) =>
                            onInputChangeContractArg({
                              functions: functions.name,
                              name: args.name,
                              type: "boolean",
                              value: e.target.value,
                            })
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
                          defaultValue={args.type_schema.type}
                          class="form-control"
                          onChange={(e) =>
                            onInputChangeContractArg({
                              functions: functions.name,
                              name: args.name,
                              type: "string",
                              value: e.target.value,
                            })
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
                  );
                })}
              {state.response[functions.name] ? (
                <>
                  <div
                    className={
                      state.response[functions.name].error
                        ? "alert  alert-danger"
                        : "alert  alert-primary"
                    }
                    role="alert"
                  >
                    <pre>
                      {JSON.stringify(
                        JSON.parse(state.response[functions.name].value),
                        null,
                        2
                      )}
                    </pre>
                    <button
                      class="btn btn-dark btn-sm mt-2"
                      onClick={() => {
                        clipboard.writeText(
                          state.response[functions.name].value
                        );
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}
              <button
                className={`btn btn-primary ${functions.classButton}`}
                data-action="view"
                data-name={functions.name}
                onClick={(e) =>
                  onBtnClickCall(e, functions.name, functions.kind, fIndex)
                }
              >
                {functions.button.length > 0 ? functions.button : "View"}
              </button>
            </div>
          </div>
        ))}

      {state.contractAbiCall &&
        state.contractAbiCall.map((functions, fIndex) => (
          <div className={`card mb-2 ${functions.className}`}>
            <div class="card-header">
              {functions.label.length > 0 ? functions.label : functions.name}
            </div>
            <div class="card-body">
              {functions.params.args &&
                functions.params.args.map((args) => {
                  return (
                    <div className={`form-group pb-2 ${args.className}`}>
                      <label>
                        {args.label.length > 0 ? args.label : args.name}
                      </label>
                      {args.type_schema.type == "string" ||
                      args.type_schema.type == "$ref" ||
                      args.type_schema.type == "integer" ||
                      args.type_schema.type == "json" ||
                      args.type_schema.type == "array" ? (
                        <input
                          class="form-control"
                          data-name={args.name}
                          data-type={
                            args.type_schema.type == "string" ||
                            args.type_schema.type[0] == "string"
                              ? "text"
                              : args.type_schema.type == "integer" ||
                                args.type_schema.type[0] == "integer"
                              ? "number"
                              : args.type_schema.type == "array"
                              ? "array"
                              : args.type_schema.$ref
                              ? "text"
                              : "text"
                          }
                          type={"string"}
                          placeholder={
                            args.type_schema.type == "string" ||
                            args.type_schema.type[0] == "string"
                              ? "string"
                              : args.type_schema.type == "integer" ||
                                args.type_schema.type[0] == "integer"
                              ? "number"
                              : args.type_schema.type == "array"
                              ? "array : a|b"
                              : args.type_schema.type == "json"
                              ? "json : { }"
                              : args.type_schema.$ref
                              ? "Account Address"
                              : "text"
                          }
                          onChange={(e) =>
                            onInputChangeContractArg({
                              functions: functions.name,
                              name: args.name,
                              type:
                                args.type_schema.type == "string" ||
                                args.type_schema.type[0] == "string"
                                  ? "text"
                                  : args.type_schema.type == "integer" ||
                                    args.type_schema.type[0] == "integer"
                                  ? "number"
                                  : args.type_schema.type == "array"
                                  ? "array"
                                  : args.type_schema.type == "json"
                                  ? "json"
                                  : args.type_schema.$ref
                                  ? "text"
                                  : "text",
                              value: e.target.value,
                            })
                          }
                        />
                      ) : (
                        ""
                      )}
                      {args.type_schema.type == "boolean" ? (
                        <select
                          defaultValue={args.type_schema.type}
                          class="form-control"
                          onChange={(e) =>
                            onInputChangeContractArg({
                              functions: functions.name,
                              name: args.name,
                              type: "boolean",
                              value: e.target.value,
                            })
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
                          defaultValue={args.type_schema.type}
                          class="form-control"
                          onChange={(e) =>
                            onInputChangeContractArg({
                              functions: functions.name,
                              name: args.name,
                              type: "string",
                              value: e.target.value,
                            })
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
                  );
                })}
              {functions.selfInputDeposit && (
                <div className={`form-group pb-2`}>
                  <label>
                    {" "}
                    {functions.labelDeposit.length > 0
                      ? functions.labelDeposit
                      : "Deposit"}
                  </label>
                  <input
                    type="text"
                    value={"" + functions.deposit}
                    defaultValue={"" + functions.deposit}
                    onChange={(e) => cDeposit(e, fIndex)}
                    class="form-control "
                  />
                </div>
              )}
              {state.response[functions.name] ? (
                <p class="card-text">{state.response[functions.name]}</p>
              ) : (
                ""
              )}
              <button
                className={`btn btn-primary ${functions.classButton}`}
                data-action="call"
                data-name={functions.name}
                onClick={(e) =>
                  onBtnClickCall(e, functions.name, functions.kind, fIndex)
                }
              >
                {functions.button.length > 0 ? functions.button : "Call"}
              </button>
            </div>
          </div>
        ))}
    </div>
  </>
);
