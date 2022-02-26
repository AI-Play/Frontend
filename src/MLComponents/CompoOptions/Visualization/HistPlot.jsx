import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showPlot, getColumns } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

function HistPlot({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기

  const [col, setCol] = useState(columns[0]); // Select

  // DOM 접근 위한 Ref
  const colRef = useRef();

  const { storage } = useContext(AppContext);

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    console.log(event.target.value);
    switch (event.target) {
      case colRef.current:
        setCol(event.target.value);
        break;
      default:
        console.log("error");
        break;
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = {
      col: col,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_PLOT, URLS_PREPROCESS.HistPlot), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        showPlot(data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Select options={columns} ref={colRef} text="시각화 대상 컬럼" onChange={handleChange} />
    </form>
  );
}

export default React.memo(HistPlot);