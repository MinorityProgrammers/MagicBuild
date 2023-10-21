const cep = "magicbuild.near";
return (
  <>
    <label></label>
    <button
      data-bs-toggle="modal"
      data-bs-target="#preview"
      class="btn btn-dark form-control "
    >
      👀 Preview
    </button>
    <div
      class="modal fade"
      id="preview"
      tabindex="-1"
      aria-labelledby="previewLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="previewLabel">
              Preview Front-End
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {props && <Widget src={`${cep}/widget/preview`} props={props} />}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
