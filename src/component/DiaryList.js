import { useState, useEffect } from "react";
import Button from "./Button";
import "./DiaryList.css";
import DiaryItem from "./DiaryItem";
import { useNavigate } from "react-router-dom";

const sortOptionList = [
    { value: "latest", name: "최신순" },
    { value: "oldest", name: "오래된 순" },
];

const DiaryList = ({ data }) => {
    const navigate = useNavigate();
    const [sortType, setSortType] = useState("latest"); //최신순 오래된순
    const [sortedData, setSortedData] = useState([]); //위의 필터 결과값

    useEffect(() => {
      const compare = (a,b) => {
          if(sortType === "latest"){
              return Number(b.date) - Number(a.date);
          }else{
              return Number(a.date) - Number(b.date);
          }
      };
      const copyList = JSON.parse(JSON.stringify(data));
      copyList.sort(compare);
      setSortedData(copyList);
  }, [data, sortType]);
    

    const onChangeSortType = (e) => {
        setSortType(e.target.value);
    };

    const onClickNew = () => {
        navigate("/new");
    };

    

    return (
        <div className="DiaryList">
        <div className="menu_wrapper">
          <div className="left_col">
            <select value={sortType} onChange={onChangeSortType}>
              {sortOptionList.map((it, idx) => (
                <option key={idx} value={it.value}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>
          <div className="right_col">
            <Button
              type={"positive"}
              text={"새 일기 쓰기"}
              onClick={onClickNew}
            />
          </div>
        </div>
        <div className="list_wrapper">
          {sortedData.map((it) => (
            <DiaryItem key={it.id} {...it} />
          ))}
        </div>
      </div>
    ); 
};
export default DiaryList;