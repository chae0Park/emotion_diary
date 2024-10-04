
import Header from "../component/Header";
import Button from "../component/Button";
import Editor from "../component/Editor";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { DiaryDispatchContext } from "../App";
import { setPageTitle } from "../component/util";

const New = () => {
    useEffect(() => {
        setPageTitle("새 일기 쓰기");
    }, []);
    const navigate = useNavigate();
    const { onCreate } = useContext(DiaryDispatchContext);

    const goBack = () => {
        navigate(-1);
    }

    

    const onSubmit = (data) => {
        const { date, content, emotionId } = data;
        onCreate(date, content, emotionId);
        navigate("/", {replace : true});
    };

    return (
        <div>
            <Header
            title={"새 일기 쓰기"}
            leftChild={<Button text={"<뒤로가기"} onClick={goBack} />} />
            <Editor onSubmit={onSubmit} />
        </div>
    )
}

export default New;