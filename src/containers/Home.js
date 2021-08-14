import React from 'react'
// import { connect } from 'react-redux'
import { MDBContainer } from "mdbreact"

export const Home = () => {
  return (
    <>
      <div className="jumbotron-image mt-n5" style={{ "height": "400px" }}>
        <div className="mask rgba-stylish-strong d-flex align-items-center h-100">
          <div className="container text-center white-text py-5">
            <h1 className="mb-0">DJR-ECOMMERCE</h1>
          </div>
        </div>
      </div>

      <MDBContainer>
        {/*Section: Block Content*/}
        <section>
          <h4 className="text-center my-5"><strong>Categories</strong></h4>
          {/* Grid row */}
          <div className="row">
            {/* Grid column */}
            <div className="col-md-6 col-lg-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom brighten z-depth-2 rounded">
                  <img className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/new/img(1).jpg" alt="Sample" />
                  <a href="#!" className="text-white">
                    <div className="mask card-mask-color waves-effect waves-light">
                      <div className="d-flex align-items-end h-100 p-3">
                        <h5 className="mb-0">Dresses</h5>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-6 col-lg-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom brighten z-depth-2 rounded">
                  <img className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/new/img(2).jpg" alt="Sample" />
                  <a href="#!" className="text-white">
                    <div className="mask card-mask-color waves-effect waves-light">
                      <div className="d-flex align-items-end h-100 p-3">
                        <h5 className="mb-0">Shirts</h5>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-6 col-lg-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom brighten z-depth-2 rounded">
                  <img className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/new/img(3).jpg" alt="Sample" />
                  <a href="#!" className="text-white">
                    <div className="mask card-mask-color waves-effect waves-light">
                      <div className="d-flex align-items-end h-100 p-3">
                        <h5 className="mb-0">Jeans</h5>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-6 col-lg-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom brighten z-depth-2 rounded">
                  <img className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/new/img(4).jpg" alt="Sample" />
                  <a href="#!" className="text-white">
                    <div className="mask card-mask-color waves-effect waves-light">
                      <div className="d-flex align-items-end h-100 p-3">
                        <h5 className="mb-0">Shoes</h5>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-6 col-lg-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom brighten z-depth-2 rounded">
                  <img className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/new/img(5).jpg" alt="Sample" />
                  <a href="#!" className="text-white">
                    <div className="mask card-mask-color waves-effect waves-light">
                      <div className="d-flex align-items-end h-100 p-3">
                        <h5 className="mb-0">Accessories</h5>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-6 col-lg-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom brighten z-depth-2 rounded">
                  <img className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/new/img(6).jpg" alt="Sample" />
                  <a href="#!" className="text-white">
                    <div className="mask card-mask-color waves-effect waves-light">
                      <div className="d-flex align-items-end h-100 p-3">
                        <h5 className="mb-0">Jewelry</h5>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
          </div>
          {/* Grid row */}
        </section>
        {/*Section: Block Content*/}
        {/*Section: Block Content*/}
        <section>
          <h4 className="text-center mt-4 mb-5"><strong>Bestsellers</strong></h4>
          {/* Grid row */}
          <div className="row">
            {/* Grid column */}
            <div className="col-md-4 mb-5">
              {/* Card */}
              <div className="card">
                <div className="view zoom overlay">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/15a.jpg" alt="Sample" />
                  <a href="#!">
                    <div className="mask waves-effect waves-light">
                      <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/15.jpg" alt="Sample" />
                      <div className="mask rgba-black-slight waves-effect waves-light" />
                    </div>
                  </a>
                </div>
                <div className="card-body text-center pt-4">
                  <h5>Black denim jacket</h5>
                  <p className="mb-2 text-muted text-uppercase small">Jackets</p>
                  <hr />
                  <p><span className="mr-1"><strong>$99.99</strong></span></p>
                  <button type="button" className="btn btn-default btn-sm mr-1 mb-2 waves-effect waves-light"><i className="fas fa-shopping-cart pr-2" />Add to cart</button>
                  {/* <button type="button" className="btn btn-light btn-sm mr-1 mb-2 waves-effect waves-light"><i className="fas fa-info-circle pr-2" />Details</button> */}
                  <button type="button" className="btn btn-danger btn-sm px-3 mb-2 material-tooltip-main waves-effect waves-light" data-toggle="tooltip" data-placement="top" title="Add to wishlist"><i className="far fa-heart" /></button>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 mb-5">
              {/* Card */}
              <div className="card">
                <div className="view zoom overlay">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/13a.jpg" alt="Sample" />
                  <a href="#!">
                    <div className="mask waves-effect waves-light">
                      <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/13.jpg" alt="Sample" />
                      <div className="mask rgba-black-slight waves-effect waves-light" />
                    </div>
                  </a>
                </div>
                <div className="card-body text-center pt-4">
                  <h5>Red hoodie</h5>
                  <p className="mb-2 text-muted text-uppercase small">Hoodies</p>
                  <hr />
                  <p><span className="mr-1"><strong>$35.99</strong></span></p>
                  <button type="button" className="btn btn-default btn-sm mr-1 mb-2 waves-effect waves-light"><i className="fas fa-shopping-cart pr-2" />Add to cart</button>
                  {/* <button type="button" className="btn btn-light btn-sm mr-1 mb-2 waves-effect waves-light"><i className="fas fa-info-circle pr-2" />Details</button> */}
                  <button type="button" className="btn btn-danger btn-sm px-3 mb-2 material-tooltip-main waves-effect waves-light" data-toggle="tooltip" data-placement="top" title="Add to wishlist"><i className="far fa-heart" /></button>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 mb-5">
              {/* Card */}
              <div className="card">
                <div className="view zoom overlay">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/14a.jpg" alt="Sample" />
                  <a href="#!">
                    <div className="mask waves-effect waves-light">
                      <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/14.jpg" alt="Sample" />
                      <div className="mask rgba-black-slight waves-effect waves-light" />
                    </div>
                  </a>
                </div>
                <div className="card-body text-center pt-4">
                  <h5>Grey sweater</h5>
                  <p className="mb-2 text-muted text-uppercase small">Sweaters</p>
                  <hr />
                  <p><span className="text-danger mr-1"><strong>$21.99</strong></span><span className="text-grey"><strong><s>$36.99</s></strong></span></p>
                  <button type="button" className="btn btn-default btn-sm mr-1 mb-2 waves-effect waves-light"><i className="fas fa-shopping-cart pr-2" />Add to cart</button>
                  {/* <button type="button" className="btn btn-light btn-sm mr-1 mb-2 waves-effect waves-light"><i className="fas fa-info-circle pr-2" />Details</button> */}
                  <button type="button" className="btn btn-danger btn-sm px-3 mb-2 material-tooltip-main waves-effect waves-light" data-toggle="tooltip" data-placement="top" title="Add to wishlist"><i className="far fa-heart" /></button>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
          </div>
          {/* Grid row */}
        </section>
        {/*Section: Block Content*/}
        {/*Section: Block Content*/}
        <section>
          <h4 className="text-center mt-4 mb-5"><strong>New products</strong></h4>

          {/* Grid row */}
          <div className="row mb-4">
            {/* Grid column */}
            <div className="col-md-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom z-depth-2 rounded">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/Interior/img(58).jpg" alt="Sample" />
                  <a href="#!">
                    <div className="mask waves-effect waves-light" />
                  </a>
                </div>
                <div className="text-center pt-4">
                  <h5 className="font-weight-bolder">Round mirror</h5>
                  <h6 className="mb-3 font-weight-bolder">$ 55.00</h6>
                  <button type="button" className="btn btn-default btn-sm mr-1 waves-effect waves-light"><i className="fas fa-shopping-cart pr-2" />Add to cart</button>
                  <button type="button" className="btn btn-danger btn-sm px-3 material-tooltip-main waves-effect waves-light" data-toggle="tooltip" data-placement="top" data-original-title="Add to wishlist"><i className="far fa-heart" /></button>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom z-depth-2 rounded">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/Interior/img(59).jpg" alt="Sample" />
                  <a href="#!">
                    <div className="mask waves-effect waves-light" />
                  </a>
                </div>
                <div className="text-center pt-4">
                  <h5 className="font-weight-bolder">Small wicker basket</h5>
                  <h6 className="mb-3 font-weight-bolder">$ 9.00</h6>
                  <button type="button" className="btn btn-default btn-sm mr-1 waves-effect waves-light"><i className="fas fa-shopping-cart pr-2" />Add to cart</button>
                  <button type="button" className="btn btn-danger btn-sm px-3 material-tooltip-main waves-effect waves-light" data-toggle="tooltip" data-placement="top" data-original-title="Add to wishlist"><i className="far fa-heart" /></button>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 mb-4">
              {/* Card */}
              <div>
                <div className="view zoom z-depth-2 rounded">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Horizontal/Interior/img(60).jpg" alt="Sample" />
                  <a href="#!">
                    <div className="mask waves-effect waves-light" />
                  </a>
                </div>
                <div className="text-center pt-4">
                  <h5 className="font-weight-bolder">Ceramic hare</h5>
                  <h6 className="mb-3 font-weight-bolder">$ 29.00</h6>
                  <button type="button" className="btn btn-default btn-sm mr-1 waves-effect waves-light"><i className="fas fa-shopping-cart pr-2" />Add to cart</button>
                  <button type="button" className="btn btn-danger btn-sm px-3 material-tooltip-main waves-effect waves-light" data-toggle="tooltip" data-placement="top" data-original-title="Add to wishlist"><i className="far fa-heart" /></button>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
          </div>
          {/* Grid row */}
        </section>
        {/*Section: Block Content*/}


        {/*Section: Block Content*/}
        <section>
          {/* Grid row */}
          <div className="row">
            {/* Grid column */}
            <div className="col-md-4 mb-4">
              {/* Card */}
              <div>
                <div className="view z-depth-1 w-50 rounded-circle avatar-sm mx-auto">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Avatars/img%20(1).jpg" alt="Sample" />
                </div>
                <div className="text-center pt-4">
                  <h5>Maria Dolores</h5>
                  <p className="mb-2 text-muted text-uppercase small">Web Designer</p>
                  <hr />
                  <p className="mb-0">
                    <i className="fas fa-quote-left pr-2" />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
            eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.
          </p>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 mb-4">
              {/* Card */}
              <div>
                <div className="view z-depth-1  w-50 rounded-circle avatar-sm mx-auto">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Avatars/img%20(2).jpg" alt="Sample" />
                </div>
                <div className="text-center pt-4">
                  <h5>Carmen Martinez</h5>
                  <p className="mb-2 text-muted text-uppercase small">Frontend Developer</p>
                  <hr />
                  <p className="mb-0">
                    <i className="fas fa-quote-left pr-2" />
            Sunt laudantium veritatis doloremque tempore, ipsam soluta doloribus praesentium modi totam
            repudiandae incidunt.
          </p>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
            {/* Grid column */}
            <div className="col-md-4 mb-4">
              {/* Card */}
              <div>
                <div className="view z-depth-1 w-50 rounded-circle avatar-sm mx-auto">
                  <img className="img-fluid w-100" src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" alt="Sample" />
                </div>
                <div className="text-center pt-4">
                  <h5>Hugo Romero</h5>
                  <p className="mb-2 text-muted text-uppercase small">Digital Marketing Analyst</p>
                  <hr />
                  <p className="mb-0">
                    <i className="fas fa-quote-left pr-2" />
            Blanditiis esse impedit, adipisci cum ratione itaque rem labore eos
            quos aliquam, est inventore repellat vel aut necessitatibus.
          </p>
                </div>
              </div>
              {/* Card */}
            </div>
            {/* Grid column */}
          </div>
          {/* Grid row */}
        </section>
        {/*Section: Block Content*/}


      </MDBContainer>
    </>
  )
}

export default Home
// const mapStateToProps = (state) => ({

// })

// const mapDispatchToProps = {

// }

// export default connect(mapStateToProps, mapDispatchToProps)(Home)
