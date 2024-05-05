import { Player } from "@lottiefiles/react-lottie-player";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useData } from "../../context/dataContext";
import UseToken from "../../hook/useToken";
import Layout from "../Layout/layout";
import { IsLoading } from "../Loading";
import MovieFilms from "./MovieFilms";
import { useInView } from "react-intersection-observer";

import TVMovie from "./TVMovie";
import ListPlay from "./listPlay";
import { useSession } from "../../context/sectionProvider";
function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}
function InViewComponent({ href, children,style }) {
  const { session, setSession } = useSession();
  const {ref,inView} = useInView({threshold:0.5});

  useEffect(() => {
    if (inView ){
      setSession(href)
    }
    
  }, [inView]);


  return (
    <motion.div ref={ref} >
      {children}
    </motion.div>
  );
}
export default function Home(props) {
  const { listWindow, listHiddenBubble } = useData();
  const { AccessToken } = UseToken();
  useEffect(() => {
    if (listWindow) {
      localStorage.setItem("counter", JSON.stringify(listWindow));
    }
  }, [listWindow]);
  useEffect(() => {
    if (listHiddenBubble)
      localStorage.setItem("hiddenCounter", JSON.stringify(listHiddenBubble));
  }, [listHiddenBubble]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const getData = async () => {
    const URL = `${process.env.REACT_APP_DB_HOST}/api/getallstudent`;
    try {
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTimeout(() => {
          setIsLoading(false);
          setPosts(data.result);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [AccessToken]);

  document.title = "Home";

  useEffect(() => {}, []);
  const contentHomeRef = useRef(null);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  });

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
            <div className="contentHome" ref={contentHomeRef}>
              <InViewComponent  style={{height:"100vh"}} href={`${process.env.REACT_APP_CLIENT_URL}/home#trending`}>
                <MovieFilms />
              </InViewComponent>
              <InViewComponent style={{height:"200vh"}} href={`${process.env.REACT_APP_CLIENT_URL}/home#playlist`}>
                <ListPlay></ListPlay>
              </InViewComponent>
              <InViewComponent  style={{height:"100vh"}} href={`${process.env.REACT_APP_CLIENT_URL}/home#tvseries`}>
                <TVMovie></TVMovie>
              </InViewComponent>
          
            </div>
          </>
        )}

        {/* <ChatApp user={auth} room={room} /> */}
      </Layout>
    </>
  );
}
