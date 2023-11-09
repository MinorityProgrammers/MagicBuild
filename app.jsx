State.init({ clientList: [], widgetList: [] });
const loadData = () => {
  const clientListData = Social.get(
    `${context.accountId}/magicbuild/clientList`
  );
  if (clientListData) {
    const clientList = JSON.parse(clientListData);
    State.update({ clientList: clientList });
  }
  const exportListData = Social.get(
    `${context.accountId}/magicbuild/widgetList`
  );
  console.log(exportListData);
  if (exportListData) {
    const exportList = JSON.parse(exportListData);
    State.update({ widgetList: exportList });
  }
};

loadData();
const Wrapper = styled.div`
.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
  color: #fff;
    background-color: #000000;
}
`;
return (
  <Wrapper>
    <div class="navbar navbar-icon-top navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#"></a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav nav-pills mr-auto" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <span
              class="nav-link px-3 active"
              id="pills-tab-home"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              <span class="fw-bold">🪄 Magic Build</span>
            </span>
          </li>
          <li class="nav-item" role="presentation">
            <span
              class="nav-link active"
              id="pills-tab-builder"
              data-bs-toggle="pill"
              data-bs-target="#pills-builder"
              type="button"
              role="tab"
              aria-controls="pills-builder"
              aria-selected="true"
              class="nav-link px-3 "
            >
              <label class="custom-control-label" for="darkSwitch">
                <span class="fw-bold">Form Builder</span>
              </label>
            </span>
          </li>
          <li class="nav-item" role="presentation">
            <span
              class="nav-link active"
              id="pills-tab-ui"
              data-bs-toggle="pill"
              data-bs-target="#pills-ui"
              type="button"
              role="tab"
              aria-controls="pills-ui"
              aria-selected="true"
              class="nav-link px-3 "
            >
              <label class="custom-control-label" for="darkSwitch">
                <span class="fw-bold">UI Builder</span>
              </label>
            </span>
          </li>
          <li class="nav-item" role="presentation">
            <span
              class="nav-link "
              id="pills-tab-block"
              data-bs-toggle="pill"
              data-bs-target="#pills-block"
              type="button"
              role="tab"
              aria-controls="pills-block"
              aria-selected="true"
              class="nav-link px-3 "
            >
              <label class="custom-control-label" for="darkSwitch">
                <span class="fw-bold">Block Builder</span>
              </label>
            </span>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="dropdown03"
              data-bs-toggle="dropdown"
              aria-expanded="true"
            >
              <span class="fw-bold">Client</span>
            </a>
            <ul
              class="dropdown-menu "
              aria-labelledby="dropdown03"
              data-bs-popper="none"
            >
              {state.clientList &&
                state.clientList.map((client, index) => {
                  if (client.archived == false) {
                    return (
                      <li>
                        <a
                          href="#"
                          class="dropdown-item"
                          id={`pills-tab-${client.clientId}`}
                          data-bs-toggle="pill"
                          data-bs-target={`#pills-${client.clientId}`}
                          type="button"
                          role="tab"
                          aria-controls={`#pills-${client.clientId}`}
                          aria-selected="true"
                        >
                          <span class="fw-bold">✨{client.clientName}</span>
                        </a>
                      </li>
                    );
                  }
                })}
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="dropdown03"
              data-bs-toggle="dropdown"
              aria-expanded="true"
            >
              <span class="fw-bold">Widget</span>
            </a>
            <ul
              class="dropdown-menu"
              aria-labelledby="dropdown03"
              data-bs-popper="none"
            >
              {state.widgetList &&
                state.widgetList.map((widget, index) => {
                  return (
                    <li>
                      <a
                        class="dropdown-item"
                        id={`pills-tab-${widget.widgetName}`}
                        data-bs-toggle="pill"
                        data-bs-target={`#pills-${widget.widgetName}`}
                        type="button"
                        role="tab"
                        aria-controls={`#pills-${widget.widgetName}`}
                        aria-selected="true"
                      >
                        <span class="fw-bold">🪄{widget.widgetName}</span>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </li>

          <li class="nav-item" role="presentation">
            <span
              class="nav-link active"
              id="pills-tab-help"
              data-bs-toggle="pill"
              data-bs-target="#pills-help"
              type="button"
              role="tab"
              aria-controls="pills-help"
              aria-selected="true"
              class="nav-link px-3 "
            >
              <label class="custom-control-label" for="darkSwitch">
                <a
                  href="https://magic-build.gitbook.io/magicbuild.ai"
                  class="fw-bold"
                >
                  🛟 Help
                </a>
              </label>
            </span>
          </li>

          <li class="nav-item" role="presentation">
            <span
              class="nav-link active"
              id="pills-tab-help"
              data-bs-toggle="pill"
              data-bs-target="#pills-help"
              type="button"
              role="tab"
              aria-controls="pills-help"
              aria-selected="true"
              class="nav-link px-3 "
            >
              <label class="custom-control-label" for="darkSwitch">
                <a
                  href="https://www.minorityprogrammers.com/"
                  class="nav-link px-3"
                >
                  ℹ Built with ❤️ by
                  <span class="fw-bold">Minority Programmers</span>
                </a>
              </label>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="container mt-2">
      <div class="row">
        <div class="col-md-12">
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade "
              id={`pills-builder`}
              role="tabpanel"
              aria-labelledby={`pills-tab-builder`}
              tabindex="0"
            >
              <Widget src={"magicbuild.near/widget/builder"} />
            </div>
            <div
              class="tab-pane fade "
              id={`pills-ui`}
              role="tabpanel"
              aria-labelledby={`pills-tab-ui`}
              tabindex="0"
            >
              <Widget src={"magicbuild.near/widget/ui"} />
            </div>
            <div
              class="tab-pane fade "
              id={`pills-block`}
              role="tabpanel"
              aria-labelledby={`pills-tab-block`}
              tabindex="0"
            >
              <Widget src={"magicbuild.near/widget/block"} />
            </div>
            <div
              class="tab-pane fade show active"
              id={`pills-home`}
              role="tabpanel"
              aria-labelledby={`pills-tab-home`}
              tabindex="0"
            >
              <Widget src={"magicbuild.near/widget/welcome"} />
            </div>

            <div
              class="tab-pane fade"
              id={`pills-help`}
              role="tabpanel"
              aria-labelledby={`pills-tab-help`}
              tabindex="0"
            ></div>
            {state.clientList &&
              state.clientList.map((client, index) => (
                <div
                  class="tab-pane fade "
                  id={`pills-${client.clientId}`}
                  role="tabpanel"
                  aria-labelledby={`pills-tab-${client.clientId}`}
                  tabindex="0"
                >
                  <Widget
                    src={"magicbuild.near/widget/builder"}
                    props={client}
                  />
                </div>
              ))}

            {state.widgetList &&
              state.widgetList.map((widget, index) => (
                <div
                  class="tab-pane fade "
                  id={`pills-${widget.widgetName}`}
                  role="tabpanel"
                  aria-labelledby={`pills-tab-${widget.widgetName}`}
                  tabindex="0"
                >
                  <Widget
                    src={`${context.accountId}/widget/${widget.widgetName}`}
                    props={widget}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </Wrapper>
);
