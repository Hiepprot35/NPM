import { useEffect, useRef } from "react";
import $ from 'jquery';

import './lol.css'

export default function FistHomePage() {
    const titleHeader = [
        "Trò chơi", "Tin Tức", "Chi tiết cập nhât", "Esport", "Vũ trụ", "Hỗ trợ"
    ]
    const titleGameName = [
        "LIÊN MINH HUYỀN THOẠI", "LMHT: TỐC CHIẾN", "VALORANT", "ĐẤU TRƯỜNG CHÂN LÝ", "HUYỀN THOẠI RUNTERRA"
    ]
    const roleChampion = ["satthu", "dausi", "phapsu", "xathu", "hotro", "dodon"]
    const logo_click_bar = useRef(null)
    const logoRiot = useRef({
        riot_text: null,
        arrow_logo: null,
        riot_text2: null,
        arrow_logo2: null,
    })
    const button_play = useRef()
    function handClicklogo_click_bar() {

        logo_click_bar.current.classList.toggle("show_logobar")


    }
    function onMouseHoverLogo() {
        // logoRiot.riot_text.style.fill = "red";
        // logoRiot.arrow_logo.style.fill = "red";
        logoRiot.current.riot_text.style.fill = "red"

        logoRiot.current.arrow_logo.style.fill = "red"
        logoRiot.current.riot_text2.style.fill = "red"
        logoRiot.current.arrow_logo2.style.fill = "red"
        logoRiot.current.arrow_logo2.style.rotate = "180deg"

    }
    function onMouseOutLogo() {
        // logoRiot.riot_text.style.fill = "red";
        // logoRiot.arrow_logo.style.fill = "red";
        logoRiot.current.riot_text.style.fill = "white"
        logoRiot.current.riot_text2.style.fill = "black"

        logoRiot.current.arrow_logo.style.fill = "white"
        logoRiot.current.arrow_logo2.style.fill = "black"

        logoRiot.current.arrow_logo2.style.rotate = "180deg"

    }
    useEffect(() => {

        var canvas = document.getElementById("myCanvas");
        var context = canvas.getContext("2d");

        var c = document.getElementsByClassName("border_canvas");
        for (let i = 0; i < c.length; i++) {

            const ctx = c[i].getContext("2d");
            ctx.lineWidth = 0.9
            ctx.moveTo(0, 0)
            ctx.lineTo(270, 0)
            ctx.lineTo(300, 30)
            ctx.lineTo(300, 150)
            ctx.lineTo(0, 150)
            ctx.lineTo(0, 0)
            ctx.stroke()
        }

        context.lineWidth = 4
        var step2 = 0;
        var step = 0;
        let start = 0
        const speed = 50;
        var step3 = 0;
        var step4 = 0;
        var step5 = 0;
        function steps() {
            context.strokeStyle = "white";
            if (step < (canvas.width - canvas.width / 15)) {
                step += speed;
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(step, 0);
                context.stroke();
                context.restore();
            }

            else if (step >= (canvas.width - canvas.width / 15) && step2 < canvas.width / 15) {

                step2 += speed
                context.beginPath();
                context.lineWidth = 2.5
                context.moveTo(step, 0);
                context.lineTo(step + step2, step2);
                context.stroke();
                context.restore();
            }
            if (step2 >= canvas.width / 15 && step3 <= canvas.height) {
                step3 += speed
                context.lineWidth = 3

                context.beginPath();
                context.moveTo(canvas.width, step2 - speed - 20);
                context.lineTo(canvas.width, step3 + canvas.width / 15);
                context.stroke();
                context.restore();
            }



            if (step3 >= canvas.height && step4 <= canvas.width) {

                step4 += speed
                context.moveTo(canvas.width, canvas.height);
                context.lineTo(canvas.width - step4, canvas.height);
                context.stroke();
                context.restore();

            }
            if (step4 >= canvas.width) {

                step5 += speed
                context.moveTo(0, canvas.height);
                context.lineTo(0, canvas.height - step5);
                context.stroke();
                context.restore();

            }

            window.requestAnimationFrame(steps);


        }


        window.requestAnimationFrame(steps);

        /**/

        var canvas_circle = document.getElementById("canvas_id")

        const ctx = canvas_circle.getContext("2d");
        const list_text = [...document.getElementsByClassName("circle_span")];
        const list_text_2 = [...document.getElementsByClassName("liner_circle")];
        const list_text_3 = [...document.getElementsByClassName("point_button")];
        const list_img = [...document.getElementsByClassName("cheo_img_div")];
        const list_button = [...document.getElementsByClassName("type_champiton")];
        const list_logo = [...document.getElementsByClassName("logo_type_champion")]

        const circle_show = [...document.getElementsByClassName("circle_boder")]
        const text_1 = [...document.getElementsByClassName("text_1")]


        $(list_button).on('click', function (e) {
            progress = -99;
            let count = 0;
            [...document.getElementsByClassName("active_text")][0] && [...document.getElementsByClassName("active_text")][0].classList.remove("active_text");
           console.log([...document.getElementsByClassName("active")][0]);
            [...document.getElementsByClassName("active")][0] && [...document.getElementsByClassName("active")][0].classList.remove("active");
            [...document.getElementsByClassName("animate")][0] && [...document.getElementsByClassName("animate")][0].classList.remove("animate");

            [...document.getElementsByClassName("choose")][0] && [...document.getElementsByClassName("choose")][0].classList.remove("choose");

            [...document.getElementsByClassName("change_back")][0].classList.remove("change_back");
            [...document.getElementsByClassName("liner_back")][0].classList.remove("liner_back");

            for (let i = 0; i < list_button.length; i++) {
                if (this.id !== list_button[count].id) {
                    count += 1
                }
                else
                    break
            }

            list_text[count].classList.toggle("active_text")

            list_img[count].classList.toggle("active")
            list_img[count].classList.toggle("animate")

            list_text_3[count].classList.toggle("change_back")
            list_text_2[count].classList.toggle("liner_back")
            list_logo[count].classList.toggle("choose")
            $(circle_show).css("left", 6.3 + count * 16.7 + "%")
            $(circle_show).css("opacity", "1")
            $(circle_show).css("color", "black")


        });
        var bigCircle = {
            center: {
                x: 637,
                y: 638
            },
            radius: 635,
        }
        let stt = 1
        let progress = 0;
        var click_progress = 0
        function loading() {
            ctx.clearRect(0, 0, canvas_circle.width, canvas_circle.height);
            if (progress > -0.99) {

                if (progress <= 0.32) {
                    progress += 0.004
                }
                else if (progress <= 0.52) {
                    progress += 0.0035
                }
                else if (progress <= 0.92) {
                    progress += 0.003
                }
                else if (progress <= 0.96) {
                    progress += 0.002;
                }
                else if (progress < (0.99 + 0.045)) {
                    progress += 0.001;
                }
                if (progress >= (0.99 + 0.045)) {
                    progress = 0;
                    if (stt <= list_img.length - 1) {
                        list_text[stt].classList.toggle("active_text");
                        list_text[stt - 1].classList.toggle("active_text");
                        list_img[stt].classList.toggle("active");
                        list_img[stt].classList.toggle("animate");
                        list_img[stt - 1].classList.toggle("active");
                        list_img[stt - 1].classList.toggle("animate");

                        list_text_2[stt].classList.toggle("liner_back");
                        list_text_2[stt - 1].classList.toggle("liner_back");

                        list_text_3[stt].classList.toggle("change_back");
                        list_text_3[stt - 1].classList.toggle("change_back");
                        $(circle_show).css("left", 6.3 + stt * 16.7 + "%");
                        list_logo[stt].classList.toggle("choose")
                        list_logo[stt - 1].classList.toggle("choose")





                    }
                    if (stt > list_img.length - 1) {

                        list_text_2[list_text.length - 1].classList.toggle("liner_back");
                        list_text_2[0].classList.toggle("liner_back");
                        list_text[0].classList.toggle("active_text");
                        list_text[list_img.length - 1].classList.toggle("active_text");
                        list_img[list_img.length - 1].classList.toggle("active");
                        list_img[list_img.length - 1].classList.toggle("animate");

                        list_img[0].classList.toggle("active");
                        list_img[0].classList.toggle("animate");
                        list_text_3[list_text.length - 1].classList.toggle("change_back");
                        list_text_3[0].classList.toggle("change_back");
                        list_logo[0].classList.toggle("choose")
                        list_logo[list_img.length - 1].classList.toggle("choose")
                        $(circle_show).css("left", 6.3 + "%");

                        stt = 0;

                    }
                    stt += 1
                }

            }
            else if (progress === -99) {
                if (click_progress > 1) {
                    click_progress = 0
                }
                click_progress += 0.01

            }
            
            drawCircle(bigCircle, progress);

            requestAnimationFrame(loading);
        }
        requestAnimationFrame(loading);
        function drawCircle(circle, progress) {
            var end = point_start(progress, 0.5) ;
            var start = point_end(progress, 0.5) ;
            var end2 = point_start(progress, 1) ;
            var start2 = point_end(progress, 1) ;
            var end3 = point_start(progress, 1.5) ;
            var start3 = point_end(progress, 1.5) ;
            var end4 = point_start(progress, 2) ;
            var start4 = point_end(progress, 2) ;
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "gray";

            ctx.beginPath();
            ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
            ctx.restore()
            ctx.stroke();
            if (progress !== -99) {
                if (progress <= 0.92) {
                    ctx.lineWidth = 5;
                }
                if (progress > 0.92 && progress < 2) {
                    ctx.lineWidth = 3;
                }
                ctx.beginPath();
                ctx.strokeStyle = "orange";

                ctx.arc(circle.center.x, circle.center.y, circle.radius, start * Math.PI, (end - 0.5) * Math.PI);
                ctx.restore()
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(circle.center.x, circle.center.y, circle.radius, start2 * Math.PI, (end2 - 0.5) * Math.PI);
                ctx.stroke();
                ctx.restore()

                ctx.beginPath();
                ctx.arc(circle.center.x, circle.center.y, circle.radius, start3 * Math.PI, (end3 - 0.5) * Math.PI);
                ctx.stroke();
                ctx.restore()


                ctx.beginPath();
                ctx.arc(circle.center.x, circle.center.y, circle.radius, start4 * Math.PI, (end4 - 0.5) * Math.PI);
                ctx.stroke();
            }
            if (progress === -99) {

                var end_click2 = x(click_progress);
                var start_click2 = x(click_progress) - 0.2;
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "orange";
                ctx.arc(circle.center.x, circle.center.y, circle.radius, (start_click2) * Math.PI, end_click2 * Math.PI);
                ctx.restore()
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(circle.center.x, circle.center.y, circle.radius, (start_click2 - 0.5) * Math.PI, (end_click2 - 0.5) * Math.PI);
                ctx.restore()
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(circle.center.x, circle.center.y, circle.radius, (start_click2 - 1.5) * Math.PI, (end_click2 - 1.5) * Math.PI);
                ctx.restore()
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(circle.center.x, circle.center.y, circle.radius, (start_click2 - 1) * Math.PI, (end_click2 - 1) * Math.PI);
                ctx.restore()
                ctx.stroke();
            }
        }
        let i = 0
        function x(x) {
            return x + 1;
        }
        function point_start(x, c) {
            return 2 * x * x - c;

        }
        function point_end(x, c) {
            return 1.5 * x * x - 0.5 - c;
        }

        $(window).scroll(function () {
            $(".text_bigger").css("animation", "animate 4s")
            $(".text_bigger").css("transition", "all 4s")


        });
    }
        , [])
    return (
        <>
                <div className="main_firstHomepage" >

                <div className="header">
                    <div
                        className=" riotbar-left-content"
                        id="riotbar-left-content"
                    >
                        <div
                            className=" riotbar-branding-switcher"
                            data-testid="riotbar:appSwitcher:button-open"
                        >
                            <div className="test" onClick={handClicklogo_click_bar} >
                                <div className="logo_riot" onMouseOver={onMouseHoverLogo} onMouseOut={onMouseOutLogo}>
                                    <p
                                        className="riotbar-logo"
                                        id="riot_click_2"
                                        data-interaction-id="riotbar_app-switcher_riot-logo"
                                        data-testid="riotbar:appSwitcher:logo"
                                    >
                                        <div className="riotbar-fist-logo">
                                            <svg
                                                width={85}
                                                height={27}
                                                ref={e => (logoRiot.current.riot_text = e)}
                                                className="logo_text_riotgame"

                                                viewBox="0 0 587.93 165"
                                            >
                                                <title>mainLogoRiotFist21</title>
                                                <path d="M98.77.33L0 46.07l24.61 93.66 18.73-2.3-5.15-58.89 6.15-2.74L54.96 136l32.01-3.93-5.69-65 6.09-2.71 11.68 66.23 32.38-3.98-6.23-71.25 6.16-2.74 12.77 72.43 32.01-3.93V19.71L98.77.33zm2.32 142.05l1.63 9.22 73.42 12.24v-30.68l-75.01 9.22h-.04zm144.49-19.22v12.63h15.57a14.84 14.84 0 01-1.92 7.31 13 13 0 01-5.6 5.11 20 20 0 01-8.9 1.8 17.53 17.53 0 01-10-2.8 17.87 17.87 0 01-6.44-8.14 33.06 33.06 0 01-2.27-12.93 31.81 31.81 0 012.32-12.81 18.14 18.14 0 016.5-8 17.27 17.27 0 019.82-2.78 19.31 19.31 0 015.36.71 14.15 14.15 0 014.33 2.09 12.92 12.92 0 013.18 3.29 15.61 15.61 0 012 4.44h17.27a27.22 27.22 0 00-3.46-10.28 28.84 28.84 0 00-7.05-8.1 32.6 32.6 0 00-9.91-5.29 37.91 37.91 0 00-12.06-1.86 37.32 37.32 0 00-14 2.6 32.6 32.6 0 00-11.36 7.61 35 35 0 00-7.61 12.21 46.15 46.15 0 00-2.73 16.44q0 11.94 4.54 20.59a32.4 32.4 0 0012.69 13.27 39.84 39.84 0 0035.84.84 28.39 28.39 0 0011.67-11q4.25-7.19 4.24-17.2v-9.76zm215.03 40.81V88.53h51.67v13.96h-34.62v16.76h27.99v13.96h-27.99v16.8h34.7v13.96h-51.75zm101.83-53.3a9 9 0 00-3.54-6.64c-2.09-1.59-5-2.38-8.69-2.38a16.63 16.63 0 00-6.26 1 8.62 8.62 0 00-3.83 2.78 6.74 6.74 0 00-1.33 4 6.2 6.2 0 00.79 3.29 7.27 7.27 0 002.4 2.45 16.54 16.54 0 003.7 1.79 40.14 40.14 0 004.64 1.31l6.63 1.54a47.19 47.19 0 019.45 3.08 27.46 27.46 0 017.2 4.68 18.84 18.84 0 014.58 6.39 20.37 20.37 0 011.61 8.29 20.65 20.65 0 01-3.54 12.11 22.56 22.56 0 01-10.15 7.85 41.31 41.31 0 01-15.93 2.76 42.69 42.69 0 01-16.17-2.81 23.22 23.22 0 01-10.72-8.48q-3.83-5.66-4-14.12h16.43a10.68 10.68 0 007.05 9.94 19.37 19.37 0 007.24 1.26 18.44 18.44 0 006.66-1.09 10 10 0 004.33-3 7.22 7.22 0 001.57-4.48 6.16 6.16 0 00-1.42-4 10.86 10.86 0 00-4.14-2.81 42.07 42.07 0 00-6.89-2.14l-8.07-1.95q-9.65-2.3-15.23-7.26t-5.54-13.44a19.86 19.86 0 013.72-12.12 24.74 24.74 0 0110.33-8.11 36.74 36.74 0 0115-2.91 35.62 35.62 0 0114.92 2.91 23.43 23.43 0 019.91 8.14 21.54 21.54 0 013.6 12.12zm-113.99 53.3h-16.87v-57.35l-1.73-.02-17.04 57.37h-16.86l-16.58-57.37-2.15.02v57.35h-16.87V88.53h28.67l14.48 50.56h1.75l14.48-50.56h28.72v75.44zm-114.66 0h18.27l-25.33-75.43h-23.15l-25.37 75.43h18.3l4.93-16.54h27.42zm-28.43-29.7l8.22-27.65h3.1l8.26 27.65zm278.58-37.76a4 4 0 01-3.67-2.44 4 4 0 010-3.1 4 4 0 01.85-1.27 4.25 4.25 0 011.27-.86 4.15 4.15 0 013.1 0 4.13 4.13 0 011.27.86 4.08 4.08 0 01.86 1.27 4 4 0 010 3.1 4.08 4.08 0 01-.86 1.27 4 4 0 01-1.27.86 4 4 0 01-1.55.31zm0-1.09a2.84 2.84 0 001.47-.39 2.94 2.94 0 001.05-1 2.93 2.93 0 000-2.92 3 3 0 00-1.06-1 2.93 2.93 0 00-2.92 0 3 3 0 00-1 1 2.86 2.86 0 000 2.92 3 3 0 001 1 2.83 2.83 0 001.46.39zm-1.46-1.15V90.6h1.78a1.52 1.52 0 01.69.15 1.13 1.13 0 01.47.42 1.24 1.24 0 01.17.66 1.16 1.16 0 01-.18.66 1 1 0 01-.48.41 1.56 1.56 0 01-.7.14h-1.2v-.72h1a.52.52 0 00.36-.12.5.5 0 00.14-.37.47.47 0 00-.14-.37.52.52 0 00-.36-.12h-.55v2.93zm2.39-1.68l.82 1.68h-1.11l-.75-1.68zM282.41 1.03h17.05v75.44h-17.05zm98.02 37.72q0 12.42-4.71 21a32.67 32.67 0 01-12.79 13.17 38.57 38.57 0 01-36.31 0 32.75 32.75 0 01-12.79-13.2q-4.71-8.66-4.71-21t4.71-21.05a32.67 32.67 0 0112.75-13.14 38.65 38.65 0 0136.31 0 32.67 32.67 0 0112.79 13.17q4.71 8.64 4.71 21.05m-17.35 0a33.35 33.35 0 00-2.23-13 17.47 17.47 0 00-6.33-8 18.57 18.57 0 00-19.45 0 17.57 17.57 0 00-6.35 8 38.59 38.59 0 000 26 17.49 17.49 0 006.35 8 18.57 18.57 0 0019.45 0 17.39 17.39 0 006.33-8 33.4 33.4 0 002.23-13M246.58 50.17l8.76 26.3h18.71l-9.74-28.33h-13.23l-.79-2.44c2.52-.49 6.83-1.25 10.65-3.85a20 20 0 008.75-16.39 24.15 24.15 0 00-3.26-12.75 21.9 21.9 0 00-9.36-8.64 32.56 32.56 0 00-14.64-3H212v75.4h17.06v-26.3zm-.32-15.61a19.35 19.35 0 01-7.26 1.18h-9.94V14.88h9.91a18.68 18.68 0 017.25 1.24 9.12 9.12 0 014.4 3.7 10 10 0 011.5 5.64 9.65 9.65 0 01-1.48 5.55 8.86 8.86 0 01-4.38 3.55M382.04 1.03v14h29.3l.8 2.45c-2.48.48-6.67 1.22-10.43 3.7v55.31h16.87v-61.5h19.62v-14z"></path>
                                            </svg>
                                        </div>
                                        <div className="riotbar-app-switcher-trigger-arrow" >
                                            <svg className="logo_text_riotgame" viewBox="0 0 8 5"
                                                ref={e => (logoRiot.current.arrow_logo = e)}
                                            >
                                                <title>mainMenuDownNonHover</title>
                                                <path d="M.707 1.707l2.586 2.586a1 1 0 001.414 0l2.586-2.586C7.923 1.077 7.477 0 6.586 0H1.414C.524 0 .077 1.077.707 1.707z"></path>
                                            </svg>
                                        </div>
                                    </p>
                                </div>
                            </div>
                            <div className="lol_logo" >
                                <a href="cac" className="link_lol_logo">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="league"
                                        width={30}
                                        height={32}
                                        viewBox="0 0 30 32"
                                        fill="none"
                                    >
                                        <g>
                                            <path
                                                d="M1.80644 9.75049C0.655032 11.8373 0 14.2271 0 16.7683C0 19.3095 0.655032 21.7015 1.80644 23.7883V9.75049Z"
                                                fill="#C28F2C"
                                            />
                                            <path
                                                d="M15 2.02222C13.7829 2.02222 12.602 2.16921 11.4688 2.43647V4.75718C12.5907 4.44093 13.7738 4.26721 15 4.26721C22.0218 4.26721 27.7153 9.84627 27.7153 16.7305C27.7153 19.8307 26.5571 22.6659 24.6464 24.8463L24.2838 26.118L23.4814 28.9331C27.4184 26.2761 30.0023 21.8195 30.0023 16.7705C30 8.62355 23.2843 2.02222 15 2.02222Z"
                                                fill="#C28F2C"
                                            />
                                            <path
                                                d="M11.4688 24.4209H22.9737H23.2253C25.1723 22.4209 26.3713 19.7126 26.3713 16.7305C26.3713 10.5746 21.2806 5.58569 15 5.58569C13.767 5.58569 12.5816 5.78168 11.4688 6.1358V24.4209Z"
                                                fill="#C28F2C"
                                            />
                                            <path
                                                d="M10.1088 0H1.55029L3.16634 3.29844V28.7038L1.55029 32H21.1922L22.9737 25.7572H10.1088V0Z"
                                                fill="#C28F2C"
                                            />
                                        </g>
                                    </svg>
                                </a>
                            </div>
                            {
                                titleHeader.map((index) => {
                                    return (
                                        <div className="text" key={index}>
                                            <div className="text">
                                                {" "}
                                                <a href="cac">
                                                    <p id="trochoi">{index}</p>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <div className="dangnhap">
                            <div className="login_button">
                                {" "}
                                <a className="login_button" href="/login" id="login">
                                    ĐĂNG NHẬP
                                </a>
                            </div>
                            <div className="dangnhap_button">
                                {" "}
                                <a className="play_button" href="/create" id="play">
                                    Đăng ký
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hide_box2" id="hide_box2" ref={logo_click_bar} >
                    <div className=" layer2">
                        <div
                            className=" riotbar-left-content layer2"
                            id="riotbar-left-content"
                        >
                            <div
                                className="riotbar-branding-switcher"
                                data-testid="riotbar:appSwitcher:button-open"
                            >
                                <div className="test" onClick={handClicklogo_click_bar}>
                                    <div className="logo_riot" onMouseOver={onMouseHoverLogo} onMouseOut={onMouseOutLogo}>
                                        <p
                                            className="riotbar-logo"
                                            id="riot_click_1"
                                            data-interaction-id="riotbar_app-switcher_riot-logo"
                                            data-testid="riotbar:appSwitcher:logo"
                                        >
                                            <div className="riotbar-fist-logo">
                                                <svg
                                                    width={85}
                                                    height={27}
                                                    ref={e => (logoRiot.current.riot_text2 = e)}

                                                    className="logo_text_riotgame"
                                                    viewBox="0 0 587.93 165"
                                                >
                                                    <title>mainLogoRiotFist21</title>
                                                    <path d="M98.77.33L0 46.07l24.61 93.66 18.73-2.3-5.15-58.89 6.15-2.74L54.96 136l32.01-3.93-5.69-65 6.09-2.71 11.68 66.23 32.38-3.98-6.23-71.25 6.16-2.74 12.77 72.43 32.01-3.93V19.71L98.77.33zm2.32 142.05l1.63 9.22 73.42 12.24v-30.68l-75.01 9.22h-.04zm144.49-19.22v12.63h15.57a14.84 14.84 0 01-1.92 7.31 13 13 0 01-5.6 5.11 20 20 0 01-8.9 1.8 17.53 17.53 0 01-10-2.8 17.87 17.87 0 01-6.44-8.14 33.06 33.06 0 01-2.27-12.93 31.81 31.81 0 012.32-12.81 18.14 18.14 0 016.5-8 17.27 17.27 0 019.82-2.78 19.31 19.31 0 015.36.71 14.15 14.15 0 014.33 2.09 12.92 12.92 0 013.18 3.29 15.61 15.61 0 012 4.44h17.27a27.22 27.22 0 00-3.46-10.28 28.84 28.84 0 00-7.05-8.1 32.6 32.6 0 00-9.91-5.29 37.91 37.91 0 00-12.06-1.86 37.32 37.32 0 00-14 2.6 32.6 32.6 0 00-11.36 7.61 35 35 0 00-7.61 12.21 46.15 46.15 0 00-2.73 16.44q0 11.94 4.54 20.59a32.4 32.4 0 0012.69 13.27 39.84 39.84 0 0035.84.84 28.39 28.39 0 0011.67-11q4.25-7.19 4.24-17.2v-9.76zm215.03 40.81V88.53h51.67v13.96h-34.62v16.76h27.99v13.96h-27.99v16.8h34.7v13.96h-51.75zm101.83-53.3a9 9 0 00-3.54-6.64c-2.09-1.59-5-2.38-8.69-2.38a16.63 16.63 0 00-6.26 1 8.62 8.62 0 00-3.83 2.78 6.74 6.74 0 00-1.33 4 6.2 6.2 0 00.79 3.29 7.27 7.27 0 002.4 2.45 16.54 16.54 0 003.7 1.79 40.14 40.14 0 004.64 1.31l6.63 1.54a47.19 47.19 0 019.45 3.08 27.46 27.46 0 017.2 4.68 18.84 18.84 0 014.58 6.39 20.37 20.37 0 011.61 8.29 20.65 20.65 0 01-3.54 12.11 22.56 22.56 0 01-10.15 7.85 41.31 41.31 0 01-15.93 2.76 42.69 42.69 0 01-16.17-2.81 23.22 23.22 0 01-10.72-8.48q-3.83-5.66-4-14.12h16.43a10.68 10.68 0 007.05 9.94 19.37 19.37 0 007.24 1.26 18.44 18.44 0 006.66-1.09 10 10 0 004.33-3 7.22 7.22 0 001.57-4.48 6.16 6.16 0 00-1.42-4 10.86 10.86 0 00-4.14-2.81 42.07 42.07 0 00-6.89-2.14l-8.07-1.95q-9.65-2.3-15.23-7.26t-5.54-13.44a19.86 19.86 0 013.72-12.12 24.74 24.74 0 0110.33-8.11 36.74 36.74 0 0115-2.91 35.62 35.62 0 0114.92 2.91 23.43 23.43 0 019.91 8.14 21.54 21.54 0 013.6 12.12zm-113.99 53.3h-16.87v-57.35l-1.73-.02-17.04 57.37h-16.86l-16.58-57.37-2.15.02v57.35h-16.87V88.53h28.67l14.48 50.56h1.75l14.48-50.56h28.72v75.44zm-114.66 0h18.27l-25.33-75.43h-23.15l-25.37 75.43h18.3l4.93-16.54h27.42zm-28.43-29.7l8.22-27.65h3.1l8.26 27.65zm278.58-37.76a4 4 0 01-3.67-2.44 4 4 0 010-3.1 4 4 0 01.85-1.27 4.25 4.25 0 011.27-.86 4.15 4.15 0 013.1 0 4.13 4.13 0 011.27.86 4.08 4.08 0 01.86 1.27 4 4 0 010 3.1 4.08 4.08 0 01-.86 1.27 4 4 0 01-1.27.86 4 4 0 01-1.55.31zm0-1.09a2.84 2.84 0 001.47-.39 2.94 2.94 0 001.05-1 2.93 2.93 0 000-2.92 3 3 0 00-1.06-1 2.93 2.93 0 00-2.92 0 3 3 0 00-1 1 2.86 2.86 0 000 2.92 3 3 0 001 1 2.83 2.83 0 001.46.39zm-1.46-1.15V90.6h1.78a1.52 1.52 0 01.69.15 1.13 1.13 0 01.47.42 1.24 1.24 0 01.17.66 1.16 1.16 0 01-.18.66 1 1 0 01-.48.41 1.56 1.56 0 01-.7.14h-1.2v-.72h1a.52.52 0 00.36-.12.5.5 0 00.14-.37.47.47 0 00-.14-.37.52.52 0 00-.36-.12h-.55v2.93zm2.39-1.68l.82 1.68h-1.11l-.75-1.68zM282.41 1.03h17.05v75.44h-17.05zm98.02 37.72q0 12.42-4.71 21a32.67 32.67 0 01-12.79 13.17 38.57 38.57 0 01-36.31 0 32.75 32.75 0 01-12.79-13.2q-4.71-8.66-4.71-21t4.71-21.05a32.67 32.67 0 0112.75-13.14 38.65 38.65 0 0136.31 0 32.67 32.67 0 0112.79 13.17q4.71 8.64 4.71 21.05m-17.35 0a33.35 33.35 0 00-2.23-13 17.47 17.47 0 00-6.33-8 18.57 18.57 0 00-19.45 0 17.57 17.57 0 00-6.35 8 38.59 38.59 0 000 26 17.49 17.49 0 006.35 8 18.57 18.57 0 0019.45 0 17.39 17.39 0 006.33-8 33.4 33.4 0 002.23-13M246.58 50.17l8.76 26.3h18.71l-9.74-28.33h-13.23l-.79-2.44c2.52-.49 6.83-1.25 10.65-3.85a20 20 0 008.75-16.39 24.15 24.15 0 00-3.26-12.75 21.9 21.9 0 00-9.36-8.64 32.56 32.56 0 00-14.64-3H212v75.4h17.06v-26.3zm-.32-15.61a19.35 19.35 0 01-7.26 1.18h-9.94V14.88h9.91a18.68 18.68 0 017.25 1.24 9.12 9.12 0 014.4 3.7 10 10 0 011.5 5.64 9.65 9.65 0 01-1.48 5.55 8.86 8.86 0 01-4.38 3.55M382.04 1.03v14h29.3l.8 2.45c-2.48.48-6.67 1.22-10.43 3.7v55.31h16.87v-61.5h19.62v-14z"></path>
                                                </svg>
                                            </div>
                                            <div className="riotbar-app-switcher-trigger-arrow" >
                                                <svg className="logo_text_riotgame" viewBox="0 0 8 5"
                                                    ref={e => (logoRiot.current.arrow_logo2 = e)}
                                                >
                                                    <title>mainMenuDownNonHover</title>
                                                    <path d="M.707 1.707l2.586 2.586a1 1 0 001.414 0l2.586-2.586C7.923 1.077 7.477 0 6.586 0H1.414C.524 0 .077 1.077.707 1.707z"></path>
                                                </svg>
                                            </div>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="thongtin_div_layer2" >
                        <div className="list_text">
                            <div className="column one_text">
                                <div className="list_trochoi">
                                    <div className="tro_choi_title">TRÒ CHƠI</div>
                                    <div className="trochoi" style={{ padding: "15px 0px 15px 15px" }}>
                                        {
                                            titleGameName.map((gameTitle, index) => (
                                                <div key={index} className="text_list trochoi_list">
                                                    <a href={`/${gameTitle}`} className="DTCL_list_link">
                                                        <span>{gameTitle}</span>
                                                    </a>
                                                </div>
                                            ))
                                        }



                                    </div>
                                </div>
                                <div className="list_trochoi">
                                    <div className="tro_choi_title">
                                        <span>FORGE</span>
                                    </div>
                                    <div className="trochoi" style={{ padding: "15px 0px 15px 15px" }}>
                                        {
                                            titleGameName.map((title) => (
                                                <div className="text_list LMHT_trochoi" key={title}>
                                                    {" "}
                                                    <a href="cac" className="LMHT_list_link">
                                                        <span>{title}</span>
                                                    </a>{" "}
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                                <div className="list_trochoi">
                                    <div className="tro_choi_title">
                                        <span>GIẢI TRÍ</span>
                                    </div>
                                    <div className="trochoi" style={{ padding: "15px 0px 15px 15px" }}>
                                        <div className="text_list LMHT_trochoi">
                                            {" "}
                                            <a href="cac" className="LMHT_list_link">
                                                <span>ARCANE</span>
                                            </a>
                                        </div>
                                        <div className="text_list DTCL_trochoi">
                                            <a href="cac" className="DTCL_list_link">
                                                <span>VŨ TRỤ</span>
                                            </a>
                                        </div>
                                        <div className="text_list VAL_trochoi">
                                            <a href="cac" className="VAL_list_link">
                                                <span>RIOT MUSIC</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column two_text">
                                <div className="list_trochoi">
                                    <div className="tro_choi_title">
                                        <span>ESPORTS</span>
                                    </div>
                                    <div className="trochoi" style={{ padding: "15px 0px 15px 15px" }}>
                                        <div className="text_list LMHT_trochoi">
                                            {" "}
                                            <a href="cac" className="LMHT_list_link">
                                                <span>LOL ESPORTS</span>
                                            </a>{" "}
                                        </div>
                                        <div className="text_list DTCL_trochoi">
                                            <a href="cac" className="DTCL_list_link">
                                                <span>VALORANT ESPORTS</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="list_trochoi">
                                    <div className="tro_choi_title">
                                        <span>KINH DOANH</span>
                                    </div>
                                    <div className="trochoi" style={{ padding: "15px 0px 15px 15px" }}>
                                        <div className="text_list LMHT_trochoi">
                                            {" "}
                                            <a href="cac" className="LMHT_list_link">
                                                <span>RIOT GAMES</span>
                                            </a>{" "}
                                        </div>
                                        <div className="text_list DTCL_trochoi">
                                            <a href="cac" className="DTCL_list_link">
                                                <span>HỖ TRỢ RIOT</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="picture_list">
                            <div className="box_img">
                                <div className="img_list img_1">
                                    <img
                                        src="https://images.contentstack.io/v3/assets/blt0eb2a2986b796d29/blt2969e05afbda6333/638fe791e133455e0fe8e041/LoR_6E_DS_WorldEnder_Riot_BarApplicationSwitcher_PromoCards_(660x428)_V2.jpg??&format=pjpg&quality=85"
                                        alt=""
                                    />
                                    <div className="text_img">
                                        <h4>
                                            Bản Mở Rộng Huyền Thoại Runeterra Mới - Trường Ca Darkin: Chiến
                                            Binh Tận Thế
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className="box_img">
                                <div className="img_list img_2">
                                    <img
                                        src="https://images.contentstack.io/v3/assets/blt0eb2a2986b796d29/bltc10ac311352c6c62/6349e60d1628061cddf4cbff/VALORANT_2022_E5-3_PlayVALORANT_RiotBarHorizontal_660x428_MB01.png??&format=pjpg&quality=85"
                                        alt=""
                                    />
                                    <div className="text_img">
                                        <h4>
                                            {" "}
                                            "Dậy sóng chiến trường cùng Đặc Vụ Kiểm Soát Harbor, tân trang
                                            bộ sưu tập của bạn với gói Ion cùng BattlePass mới toanh và tham
                                            gia Phần Xếp Hạng mới - tất cả sẽ có tại VALORANT HỒI 05//PHẦN
                                            III."
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    <div className="content">
                        <div className="container_firsthomePage">
                            <div className="body_container">
                                <div className="video_layer">
                                    <video
                                        autoPlay
                                        loop
                                        className="video_cheo_background"


                                    >
                                        <source src="/images/thacnuoc.mp4" type="video/mp4" />
                                        <source src="/images/thacnuoc.mp4" type="video/ogg" />
                                        Sorry, your browser doesn't support videos.

                                    </video>
                                    <div className="video_cheo_div">

                                        <section className="video_section">
                                            <div className="video_cheo_divsec" style={{ width: "100%" }}>
                                                <canvas id="myCanvas" width={2480} height={1236} />
                                                <video
                                                    autoPlay
                                                    loop
                                                    className="video_cheo"


                                                >
                                                    <source src="/images/thacnuoc.mp4" type="video/mp4" />
                                                    <source src="/images/thacnuoc.mp4" type="video/ogg" />
                                                    Sorry, your browser doesn't support videos.

                                                </video>
                                                <div className="button_play_incheo">
                                                    <div className="img_lol">
                                                        <img
                                                            className="lol"
                                                            src="https://www.leagueoflegends.com/static/logo-vi-vn-317e4bb4521de5b27ff8392f38d3853a.png"
                                                            sizes="(max-width: 599px) 80vw,40vw"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <button className="play_in_cheo" ref={button_play}>CHƠI GAME</button>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="informartion_row2">
                                    <section className="information_section">
                                        <div className="tintuc">
                                            <article className="tintuc_chitiet">
                                                <a href="cac" className="chitieu_mot">
                                                    <div className="boder_container">
                                                        {" "}
                                                        <canvas className="border_canvas" id="border_canvas" />
                                                    </div>
                                                    <div className="canvas_container_layer2">
                                                        <canvas className="canvas_container_layer2"></canvas>
                                                    </div>
                                                    <div className="thongtin_mot">
                                                        <img src="/images/homepage/cot1.jpg" alt="" />
                                                    </div>
                                                    <div className="thongtin_mot_text">
                                                        <div className="title_thongtin">CẬP NHẬT TRÒ CHƠI </div>
                                                        <h1 style={{ fontSize: 15 }}>
                                                            Thông tin bản cập nhật 13.11
                                                        </h1>
                                                        <p>
                                                            Chào mừng bạn đến với mùa giải Xếp Hạng 2023 và Bản Cập
                                                            Nhật đầu tiên của năm Quý Mão 13.1! -Thay đổi cách leo
                                                            hạng -Cập nhật tầm trung cho Jax -Cập nhật cân bằng ARAM
                                                            -Skin Tết Nguyên Đán
                                                        </p>
                                                    </div>
                                                </a>
                                            </article>
                                            <article className="tintuc_chitiet">
                                                <a href="cac" className="chitieu_mot">
                                                    <div className="boder_container">
                                                        <canvas
                                                            className="border_canvas"
                                                            id="border_canvas2"
                                                        ></canvas>
                                                    </div>
                                                    <div className="canvas_container_layer2">
                                                        <canvas className="canvas_container_layer2"></canvas>
                                                    </div>
                                                    <div className="thongtin_mot">
                                                        <img src="/images/homepage/co2.jpg" alt="" />
                                                    </div>
                                                    <div className="thongtin_mot_text">
                                                        <div className="title_thongtin">DEV </div>
                                                        <h1 style={{ fontSize: 15 }}>
                                                            Phân Tích Lối Chơi 13/01: Trang Bị Đỡ Đòn Thần Thoại
                                                        </h1>
                                                        <p>
                                                            Nhà Thiết Kế RiotMadnessHeroo trò chuyện về quá trình phát
                                                            triển các trang bị đỡ đòn thần thoại mới
                                                        </p>
                                                    </div>
                                                </a>
                                            </article>
                                            <article className="tintuc_chitiet">
                                                <a href="facebook.com" className="chitieu_mot">
                                                    <div className="boder_container">
                                                        <canvas
                                                            className="border_canvas"
                                                            id="border_canvas"
                                                        ></canvas>
                                                    </div>
                                                    <div className="canvas_container_layer2">
                                                        <canvas className="canvas_container_layer2"></canvas>
                                                    </div>
                                                    <div className="thongtin_mot">
                                                        <img src="/images/homepage/cot3.jpg" alt="" />
                                                    </div>
                                                    <div className="thongtin_mot_text">
                                                        <div className="title_thongtin">CỘNG ĐỒNG</div>
                                                        <h1 style={{ fontSize: 15 }}>
                                                            Teemo Ngoài Vũ Trụ... Gần Như Là Vậy
                                                        </h1>
                                                        <p>
                                                            Cần bao nhiêu sinh viên kỹ thuật hàng không và vật lý để
                                                            đưa một chú yordle ra ngoài vũ trụ?
                                                        </p>
                                                    </div>
                                                </a>
                                            </article>
                                        </div>
                                        <div className="left_layer1">
                                            <div className="tin_tuc_tieu_bieu">
                                                <p> TIN TỨC TIÊU BIỂU ----</p>
                                            </div>
                                        </div>
                                    </section>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="Champion_Circle">
                        <section className="section_body">
                            <div className="section_container">
                                <div className="left_layer1">
                                    <div
                                        className="tin_tuc_tieu_bieu"
                                        style={{ textTransform: "uppercase" }}
                                    >
                                        Tướng----
                                    </div>
                                </div>
                                <div className="tuong_section">
                                    <div className="text_haychontuong">
                                        <div className="text_bigger">
                                            <span className="bigger bigger2">Pick your</span>
                                            <span className="bigger bigger1">CHAMPION</span>
                                        </div>
                                        <div className="haychontuong_button" />
                                    </div>
                                    <div className="circle_div">
                                        <div className="text_circle_div">
                                            <div className="button_left" />
                                            <div className="button_center">
                                                <div className="text_1" id="text_1">
                                                    <button className="type_champiton" id="satthu_id">
                                                        <span className="logo_circle 1">
                                                            <span className="circle_span active_text">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M59.84 7.78L50 17.63l-4.43-4.43-5.41-5.42a46.63 46.63 0 1019.68 0zm-12 12L50 22l2.2-2.19 4.67-4.67a38.86 38.86 0 11-13.74 0zM50 96.89a43.52 43.52 0 01-10.82-85.68l2.59 2.59a40.42 40.42 0 1016.46 0l2.59-2.59A43.52 43.52 0 0150 96.89z"></path>
                                                                    <path d="M55.44 5.44L50 10.88l-5.44-5.44L50 0z" />
                                                                </svg>
                                                            </span>
                                                            <span className="logo_type_champion choose ">
                                                                <svg
                                                                    className="logo click_logo"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M56.59 73.71l1.67-2.88c5.75-9.34 5.51-16 3.83-20.59a39.78 39.78 0 01-9.1 16 2 2 0 01-1.43.48H48.2a2.17 2.17 0 01-1.67-.72 39.78 39.78 0 01-9.1-16c-1.68 4.55-1.68 11.26 3.83 20.59l1.68 2.88-3.36 5.75 10.06 17.72L59.7 79.22z"></path>
                                                                    <path d="M73.11 38.74c-3.35-4.31-6-10-6-18.91 0-4.07-3.59-8.15-7.66-12-4.79-4.31-5.75-5.74-9.58-5.74s-4.79 1.43-9.34 5.74c-4.07 3.83-7.66 7.91-7.66 12 0 8.86-2.88 14.6-6 18.68L12.76 52.87 2.23 45.69v12.93S2.47 84 39.58 97.89c0 0-14.13-7.18-16.28-31.13-.24-1.67-.24-9.1-.24-10.29A119.77 119.77 0 0036.71 74c-.72-1.2-1.44-2.64-2.16-3.83-5-10.54-4.07-18.2-1.67-23.47a22.77 22.77 0 017.42-8.86l9.58 9.58 9.58-9.58a22.77 22.77 0 017.42 8.86c2.4 5.27 3.59 12.93-1.43 23.23-.72 1.38-1.45 2.58-2.16 4.07a119.77 119.77 0 0013.65-17.53c0 1.19 0 8.62-.24 10.29-2.39 23.95-16.28 31.13-16.28 31.13C97.53 84 97.77 58.62 97.77 58.62V45.69l-10.53 7.18z"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                        <span className="text_chapmion">Sát Thủ</span>
                                                        <div className="liner_circle liner_back" />
                                                        <span className="point_container">
                                                            <span className="point_button change_back" />
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="text_1 " id="text_2">
                                                    <button className="type_champiton" id="dausi_id">
                                                        <span className="logo_circle 2">
                                                            <span className="circle_span ">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M59.84 7.78L50 17.63l-4.43-4.43-5.41-5.42a46.63 46.63 0 1019.68 0zm-12 12L50 22l2.2-2.19 4.67-4.67a38.86 38.86 0 11-13.74 0zM50 96.89a43.52 43.52 0 01-10.82-85.68l2.59 2.59a40.42 40.42 0 1016.46 0l2.59-2.59A43.52 43.52 0 0150 96.89z"></path>
                                                                    <path d="M55.44 5.44L50 10.88l-5.44-5.44L50 0z" />
                                                                </svg>
                                                            </span>
                                                            <span className="logo_type_champion">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M67.84 56.35v5.5c8.62-8.62 14.37 0 14.37 0C112.14 40.78 90.35 2 90.35 2s-.72 17.24-15.08 27.77v16.52c-.24 4.79-3.84 7.9-7.43 10.06M17.79 62.09s4.07-6.46 10.78-2.63L20.91 48.2l6.7-16c-17.24-10.54-18-29.93-18-29.93S-12.14 41 17.79 62.09M26.89 83.89l5.51-18.68-.24-.48L19.23 77.9A17.78 17.78 0 017.5 83.17H3l-1 2.39 12 11.5zM92.27 83.89a16.24 16.24 0 01-11.74-5.27L68.8 66.88l3.83 17.72L85.8 98l12-11.49-1-2.4zM55.87 42.7c0 .24-.24.48-.24.71h.72c5.75.48 7.66 2.64 9.1 7.67a9.35 9.35 0 002.39-1.92c1-1 1.68-1.67 1.68-2.63V28.09a2 2 0 00-1.68-1.92l-31.37-5.74H36a2.39 2.39 0 00-2.39 2.39v6.71l24.9 3.35z"></path>
                                                                    <path d="M60.18 54c-1.2-5.27-1.44-4.55-5.75-4.79L40.78 48v-3.87h5.51A4.09 4.09 0 0050.36 41l1-3.35L32.4 35l-5 12.22 11.74 17-5.54 18.47L49.88 98l16.53-15.07s-6.23-28.5-6.23-29M49.88 2.23l-4.79 10.29 4.79 3.83 4.79-3.83zM62.1 9.41l1.43 6h6l2.87-11zM30.25 15.4h6l.24-.72 1.2-5.27-10.3-5z"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                        <span className="text_chapmion">Đấu Sĩ </span>
                                                        <div className="liner_circle " />
                                                        <span className="point_container">
                                                            <span className="point_button" />
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="text_1 " id="text_3">
                                                    <button className="type_champiton" id="ap_id">
                                                        <span className="logo_circle">
                                                            <span className="circle_span ">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M59.84 7.78L50 17.63l-4.43-4.43-5.41-5.42a46.63 46.63 0 1019.68 0zm-12 12L50 22l2.2-2.19 4.67-4.67a38.86 38.86 0 11-13.74 0zM50 96.89a43.52 43.52 0 01-10.82-85.68l2.59 2.59a40.42 40.42 0 1016.46 0l2.59-2.59A43.52 43.52 0 0150 96.89z"></path>
                                                                    <path d="M55.44 5.44L50 10.88l-5.44-5.44L50 0z" />
                                                                </svg>
                                                            </span>
                                                            <span className="logo_type_champion">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M84.48 77.3h13.41l-3.83-12.93h-9.58a36.73 36.73 0 00-27.54 12.45L50 85l-6.94-8.14a36.73 36.73 0 00-27.54-12.49H5.94L2.11 77.3h13.41a36.73 36.73 0 0127.54 12.45l.71.72h-9.1v7.42h30.9v-7.42h-9.1l.71-.72a35.85 35.85 0 0127.3-12.45"></path>
                                                                    <path d="M56.23 54.31L50 62.21l-6.23-7.9a5.42 5.42 0 01-.24-6.47L50 37.31l6.47 10.53a5.42 5.42 0 01-.24 6.47M42.58 28.93l-7.91 12.69a13.37 13.37 0 00.72 15.09L50 75.14l14.61-18.43a13 13 0 00.72-15.09L50 17l-.48.72a5.58 5.58 0 01-4.31 1.68c-4.07 0-7.18-8.62 4.55-17.24 0 0-28.74 5.5-14.85 30.41z"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                        <span className="text_chapmion">Pháp Sư </span>
                                                        <div className="liner_circle " />
                                                        <span className="point_container">
                                                            <span className="point_button" />
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="text_1 " id="text_4">
                                                    <button className="type_champiton" id="ad_id">
                                                        <span className="logo_circle">
                                                            <span className="circle_span ">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M59.84 7.78L50 17.63l-4.43-4.43-5.41-5.42a46.63 46.63 0 1019.68 0zm-12 12L50 22l2.2-2.19 4.67-4.67a38.86 38.86 0 11-13.74 0zM50 96.89a43.52 43.52 0 01-10.82-85.68l2.59 2.59a40.42 40.42 0 1016.46 0l2.59-2.59A43.52 43.52 0 0150 96.89z"></path>
                                                                    <path d="M55.44 5.44L50 10.88l-5.44-5.44L50 0z" />
                                                                </svg>
                                                            </span>
                                                            <span className="logo_type_champion">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M28.69 27.25h6.94l1.92-6.94-13.41-7.91zM71.31 27.25l4.55-14.85-13.41 7.91 1.92 6.94zM71.31 35.39c-1.43 0-12.21-3.83-12.21-3.83L50 42.34l-9.1-10.78s-10.54 3.83-12.21 3.83c-7.67 0-4.79-7.18-4.79-7.18S4.26 48.32 2.11 64.13c0 0 5.74-8.86 24.42-13.17a26.22 26.22 0 0013.89 12.93c-.72-3.11-1.44-6.71-2.15-10.06a22.36 22.36 0 01-3.84-4.31c.72 0 7.19-.72 8.15-.72.71 2.64 4.55 28.74 4.55 28.74l-7 10.3v10L50 93.82l9.82 4.07V87.6l-7-10.3s3.84-26.1 4.55-28.74c.72 0 7.19.72 8.15.72a16.52 16.52 0 01-3.84 4.31 98.08 98.08 0 00-2.15 10.06 25.33 25.33 0 0013.94-12.93c18.68 4.55 24.42 13.17 24.42 13.17C95.74 48.32 76.1 28 76.1 28s2.88 7.42-4.79 7.42"></path>
                                                                    <path d="M50 2.11l-7.66 21.31h.24L50 33.24l7.42-9.82h.24z" />
                                                                </svg>
                                                            </span>
                                                        </span>
                                                        <span className="text_chapmion">Xạ Thủ </span>
                                                        <div className="liner_circle " />
                                                        <span className="point_container">
                                                            <span className="point_button" />
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="text_1 " id="text_5">
                                                    <button className="type_champiton" id="sp_id">
                                                        <span className="logo_circle">
                                                            <span className="circle_span ">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M59.84 7.78L50 17.63l-4.43-4.43-5.41-5.42a46.63 46.63 0 1019.68 0zm-12 12L50 22l2.2-2.19 4.67-4.67a38.86 38.86 0 11-13.74 0zM50 96.89a43.52 43.52 0 01-10.82-85.68l2.59 2.59a40.42 40.42 0 1016.46 0l2.59-2.59A43.52 43.52 0 0150 96.89z"></path>
                                                                    <path d="M55.44 5.44L50 10.88l-5.44-5.44L50 0z" />
                                                                </svg>
                                                            </span>
                                                            <span className="logo_type_champion">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M90.4 2.11c0 27.3-25.4 36.63-25.4 36.63L60.94 61a8.39 8.39 0 00-.48 2.39 6.95 6.95 0 0013.89 0 6.7 6.7 0 00-5.75-6.7c6.71-11.5 16.29-6 16.29-6 1.43-1.44 2.63-2.88 3.83-4.07l-7.19-2.88h9.34a38.5 38.5 0 005.75-11.25L87 28.69h10.3a33 33 0 00-6.9-26.58M35.32 38.74S9.93 29.41 9.93 2.11c0 0-9.82 10.77-7.42 26.1h10.3L3.23 32a41.09 41.09 0 004.07 8.9h11l-8.61 3.59a39.83 39.83 0 005.27 6s9.58-5.51 16.29 6a6.7 6.7 0 00-5.75 6.7 6.95 6.95 0 1013.41-2.39zM45.14 22.7l2.63-6.7h4.79l2.63 6.94-5 13.89zm-1-16l-7 16 10.15 25.38v23.71l-5 16 5 10H53l5-10-5-16V48.08L63.1 22.7l-7-16z"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                        <span className="text_chapmion">Hỗ Trợ </span>
                                                        <div className="liner_circle " />
                                                        <span className="point_container">
                                                            <span className="point_button" />
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="text_1 " id="text_6">
                                                    <button className="type_champiton" id="dodon_id">
                                                        <span className="logo_circle">
                                                            <span className="circle_span ">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M59.84 7.78L50 17.63l-4.43-4.43-5.41-5.42a46.63 46.63 0 1019.68 0zm-12 12L50 22l2.2-2.19 4.67-4.67a38.86 38.86 0 11-13.74 0zM50 96.89a43.52 43.52 0 01-10.82-85.68l2.59 2.59a40.42 40.42 0 1016.46 0l2.59-2.59A43.52 43.52 0 0150 96.89z"></path>
                                                                    <path d="M55.44 5.44L50 10.88l-5.44-5.44L50 0z" />
                                                                </svg>
                                                            </span>
                                                            <span className="logo_type_champion">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 100 100"
                                                                >
                                                                    <path d="M85.92 63.89L55 90V67.48h7.42v-9.1H37.55v9.1H45v22.75L14.08 63.89 8.33 21l27.54-10.51a39.13 39.13 0 0128.26 0L91.67 21zM66.28 5a47.61 47.61 0 00-32.56 0L2.11 17.19l6.7 49.57L41.86 95A13 13 0 0050 97.89 12.5 12.5 0 0058.14 95l33.05-28.24 6.7-49.57z"></path>
                                                                    <path d="M78.74 32.28L62 21.26v5.27H38v-5.27l-16.26 7.19a2.9 2.9 0 00-1.67 3.11l4.31 19.16a3.22 3.22 0 002.15 2.15l11.26 2.4V50h23.94v5.27l11.5-2.4a2.52 2.52 0 002.15-2.15l4.31-15.57a2.39 2.39 0 00-1-2.87M57.42 20.07H42.58L50 11.68z"></path>
                                                                </svg>
                                                            </span>
                                                        </span>
                                                        <span className="text_chapmion">Đỡ Đòn</span>
                                                        <div className="liner_circle " />
                                                        <span className="point_container">
                                                            <span className="point_button" />
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="circle_boder" id="circle_2"></div>
                                            </div>
                                            <div className="button_left" />
                                        </div>
                                        <div className="circle_right">
                                            <div className="canvas1 canvas_2">
                                                <canvas
                                                    className="canvas_2"
                                                    id="canvas_id"
                                                    width={1400}
                                                    height={1400}
                                                />
                                            </div>
                                            <div className="cheo_picture">
                                                {
                                                    roleChampion.map((title, index) => {
                                                        if (index === 0) {
                                                            return (
                                                                <div className="cheo_img_div active animate" id={index} key={index}>
                                                                    <figure className="figure_div 1">
                                                                        <img src={`/images/homepage/${title}.png`} alt="" />
                                                                    </figure>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="cheo_img_div" id={index} key={index}>
                                                                    <figure className="figure_div 1">
                                                                        <img src={`/images/homepage/${title}.png`} alt="" />
                                                                    </figure>
                                                                </div>
                                                            );
                                                        }
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>

        </>

    )
}