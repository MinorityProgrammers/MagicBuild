State.init({
  clientName: "",
  clientContract: props.clientContract ? props.clientContract : "",
  clientList: props.clientList ? props.clientList : [],
  displayModal: false,
  error,
});
const onInputChangeClientName = ({ target }) => {
  State.update({ clientName: target.value });
};
const onInputChangeClientContract = ({ target }) => {
  State.update({ error: null });
  State.update({ clientContract: target.value });
};
const showModal = (e, type) => {
  console.log(state.displayModal);
  if (type == "show") {
    State.update({ displayModal: true });
  }
  if (type == "close") {
    State.update({ displayModal: false });
  }
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
          onCommit: () => {
            State.update({ displayModal: false });
          },
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
  <div>
    <label></label>
    <button
      class="btn btn-dark form-control "
      onClick={(e) => showModal(e, "show")}
    >
      Save Client
    </button>
    {state.displayModal && (
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
                <h1 class="modal-title fs-5" id="createClientLabel">
                  Create Client
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  onClick={(e) => showModal(e, "close")}
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
                  onClick={(e) => showModal(e, "close")}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={saveClient}
                  class="btn btn-primary"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show"></div>
      </>
    )}
  </div>
);
