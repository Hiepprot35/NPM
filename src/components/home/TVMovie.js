import React, { useEffect, useState } from "react";
import { TheMovieApi } from "../../function/getApi";
import "./TVMovie.scss";
export default function TVMovie() {
  const [ListTV, setListTV] = useState();
  const getData = async () => {
    const res = await TheMovieApi(
      "https://api.themoviedb.org/3/trending/tv/week?language=en-US&page1"
    );
    const res2 = await TheMovieApi(
      "https://api.themoviedb.org/3/trending/tv/week?language=en-US&page2"
    );
    const data = res.results.concat(res2.results);
    setListTV(data);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="TVMovieClass" id="tvseries">

        {
            ListTV&&ListTV.map((e)=>{})
        }
      </div>
    </>
  );
}
