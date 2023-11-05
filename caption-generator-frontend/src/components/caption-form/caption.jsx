import './caption.css'

export default function Caption() {

    return (
        <div class="custom-card card">
            <div class="card-body">
                <h5 class="card-title mb-3">Upload your image here..</h5>
                <p class="card-text">
                    <div class="mb-3">
                        <label for="formFile" class="form-label"></label>
                        <input class="form-control" type="file" id="formFile"/>
                    </div>
                </p>
                <a href="#" class="my-button btn btn-primary">Upload</a>
            </div>
        </div>
    )

}