import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSession } from "../../context/sectionProvider";
import useAuth from "../../hook/useAuth";
import Layout from "../Layout/layout";
import MovieFilms from "./MovieFilms";
import TVMovie from "./TVMovie";
import ListPlay from "./listPlay";
function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}
export function Image({ src, style, className, loading }) {
  return (
    <img
      alt="Avatar"
      loading="lazy"
      className={className}
      style={style}
      src={
        src || loading
          ? src
          : process.env.REACT_APP_CLIENT_URL + "/images/loading.svg"
      }
    ></img>
  );
}
export function InViewComponent({ href, children, style }) {
  const { session, setSession } = useSession();
  const { ref, inView } = useInView({ threshold: 0.5 });
  useEffect(() => {
    if (inView) {
      setSession(href);
    }
  }, [inView]);

  return <motion.div ref={ref}>{children}</motion.div>;
}
export default function Home(props) {
  const [Img, setImg] = useState();
  document.title = "Home";
  useEffect(() => {}, []);
  const contentHomeRef = useRef(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  });
  const { auth } = useAuth();

  return (
    <>
      <motion.div
        style={{
          scaleX: scrollYProgress,
        }}
        className="progress-bar"
      ></motion.div>
      <Layout link={"/home"}>
        {!props.isHidden && (
          <>
            <div className="contentHome bg-black" ref={contentHomeRef}>
              <InViewComponent
                style={{ height: "100vh" }}
                href={`${process.env.REACT_APP_CLIENT_URL}/home#trending`}
              >
                <MovieFilms setImg={setImg} />
              </InViewComponent>
              <InViewComponent
                style={{ height: "100vh" }}
                href={`${process.env.REACT_APP_CLIENT_URL}/home#tvseries`}
              >
                <TVMovie Img={Img} />
              </InViewComponent>

              {auth?.userID && (
                <InViewComponent
                  style={{ height: "200vh" }}
                  href={`${process.env.REACT_APP_CLIENT_URL}/home#playlist`}
                >
                  <ListPlay Img={Img} />
                </InViewComponent>
              )}
            </div>
          </>
        )}

        {/* <ChatApp user={auth} room={room} /> */}
      </Layout>
    </>
  );
}
