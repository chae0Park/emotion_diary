import {Routes,Route } from "react-router-dom";
import React, { useReducer, useRef, useEffect, useState } from "react";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import './App.css';


function reducer(state, action){
  switch (action.type){
    case "INIT": {
      return action.data;
    }
    case "CREATE":{
      const newState = [action.data, ...state];
      localStorage.setItem("diary" , JSON.stringify(newState));
      return newState;
    }
    case "UPDATE": {
      const newState = state.map((it) => 
        String(it.id) === String(action.data.id) ? {...action.data} : it
      );
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "DELETE": {
      const newState = state.filter((it) => String(it.id) !== String(action.targetId));
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    default: {
      return state;
    }
  }
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();






function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [ data, dispatch ] = useReducer(reducer, []);
  const idRef = useRef(0);

  useEffect(() => {

    //diary라는 값을 불러올거임 
    //그 전에 이 다이어리값이 존재하는지 undefined는 아닌지 확인
   const rawData = localStorage.getItem("diary");
   if(!rawData){
      setIsDataLoaded(true);
      return;
   }

   //rawData 배열에 값이 0 일 경우도 setIsDataLoaded(true); return;
    const localData = JSON.parse(rawData);
    if(localData === 0){
      setIsDataLoaded(true);
      return;
    }

    //불러온 일기를 내림차순으로 정렬, 값이 가장 큰 id에 1을 더해 
    //id.Ref의 값으로 설정 
    localData.sort((a,b) => Number(b.id) - Number(a.id));
    idRef.current = localData[0].id + 1;

    //불러온 일기 데이터로 state를 초기화
    dispatch({type: "INIT", data: localData});
    setIsDataLoaded(true);
  }, []);

  const onCreate = ( date, content, emotionId ) => { 
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
    idRef.current += 1;
  };

  const onUpdate = (targetId, date, content, emotionId) => {
    dispatch({
      type: "UPDATE",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
  };

  const onDelete = (targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  };

  if(!isDataLoaded){
    return <div>데이터를 불러오는 중입니다</div>;
  }else{
    return(
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          <div className="App">
            <Routes> 
              <Route path ="/" element={<Home />} />
              <Route path ="/new" element={<New />} />
              <Route path ="/diary/:id" element={<Diary />} />
              <Route path ="/edit/:id" element={<Edit />} />
            </Routes>  
        </div>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    );
  }
}
export default App;
