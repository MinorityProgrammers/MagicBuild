State.init({ clientName: "", clientContract: "", clientList: [], error });
const onInputChangeClientName = ({ target }) => {
  State.update({ clientName: target.value });
};
const onInputChangeClientContract = ({ target }) => {
  State.update({ error: null });
  State.update({ clientContract: target.value });
};
const saveClient = () => {
  if (state.clientName.length < 5) {
    State.update({
      error: "Name requires more than 5 characters",
    });
  } else {
    asyncFetch("https://rpc.near.org/", {
      body: JSON.stringify({
        method: "query",
        params: {
          request_type: "view_code",
          account_id: state.clientContract,
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
      if (res.body.result.code_base64) {
        const data = state.clientList;
        const clientData = {
          id: Date.now(),
          name: state.clientName,
          address: state.clientContract,
          archived: false,
          abi: null,
        };
        data.push(clientData);
        const saveData = {
          magicbuild: {
            clientlist: data,
          },
        };
        Social.set(saveData, {
          force: true,
          onCommit: () => {},
          onCancel: () => {},
        });
      } else {
        State.update({
          error:
            "Unable to save Account ID because the contract has not been deployed yet!",
        });
      }
    });
  }
};

return (
  <>
    <label></label>
    <button
      data-bs-toggle="modal"
      data-bs-target="#createClient"
      class="btn btn-dark form-control "
    >
      Save Client
    </button>
    <div
      class="modal fade"
      id="createClient"
      tabindex="-1"
      aria-labelledby="createClientLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createClientLabel">
              Create Client
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
              <label>Name</label>
              <input
                class="form-control"
                onChange={(e) => onInputChangeClientName(e)}
              />
            </div>
            <div class="form-group">
              <label>Address</label>
              <input
                class="form-control"
                onChange={(e) => onInputChangeClientContract(e)}
              />
            </div>
            <div class="form-group">
              <label>Chain</label>
              <select class="form-control">
                <option selected>Near Chain</option>
                <option disabled>Ethereum Chain</option>
                <option disabled>AVAX Chain</option>
              </select>
            </div>
            {!state.error && (
              <small class="form-text text-muted">
                A new Client will be created.
              </small>
            )}

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
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" onClick={saveClient} class="btn btn-primary">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
sa
