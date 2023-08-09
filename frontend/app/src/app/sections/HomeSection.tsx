export const HomeSection = () => {
    return (
        <section id="home" className="h-screen bg-light dark:bg-dark text-center forest-summer-background" >
            {/* <div className="navbar-spacer"></div>
            <div className="navbar-spacer"></div>
            <div className="navbar-spacer"></div>
            <!-- <div className="navbar-spacer"></div> -->
            <div data-aos="zoom-in" className="col-sm-12 d-flex justify-content-center mb-3">
                <img
                    src="assets/images/logo-circulo.png"
                    alt="Logo JBU"
                    title="Logo JBU"
                    class="img-fluid img-thumbnail"
                    style="background-color: transparent; border: 0; filter: drop-shadow(5px 5px 5px #222222);"
                    width="350"
                />
    </div> */}
            <h1
                className="text-white"
                style={{ textShadow: "5px 5px 5px black", fontSize: "3rem" }} data-aos="zoom-in-up">Jardín Botánico de Ushuaia</h1>
        </section>
    );
}