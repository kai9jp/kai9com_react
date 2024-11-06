import React, { useState, FormEvent, Dispatch, Fragment, useEffect } from "react";
import { IStateType, INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import Swal from 'sweetalert2';
import styles from "./SrcMakeForm.module.css";
import * as comUtil  from "../../common/comUtil";
import ExcelDropzone from "../../common/components/ExcelDropzone";
import * as xlsx from 'xlsx';
import Checkbox from "../../common/components/Checkbox";
import LoadingIndicator from '../../common/components/LoadingIndicator';
import { callApi } from "../../common/comUtil";


const Syori1Form: React.FC = () => {
  //シート名のリスト
  const [SheetNames, setSheetNames] = useState<string[]>([]);  
  //シート名の選択状態を記憶するリスト
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  //エクセルがロードされているか判定
  const [load_excel, setload_excel] = useState<Blob | null>(null);
  //制御文字を残すかのフラグ
  const [isTargetStrLeave, setIsTargetStrLeave] = useState(false);
  //テスト系を生成するかのフラグ
  const [isNonTestMake, setIsNonTestMake] = useState(false);
  //プロジェクト名
  const [projectName, setProjectName] = useState<string>(() => {
    // 初期値をローカルストレージから取得
    return localStorage.getItem("SrcMakeForm.projectName") || "";
  });  
  //javaパッケージ名(1階層目)
  const [packageName1, setPackageName1] = useState<string>(() => {
    // 初期値をローカルストレージから取得
    return localStorage.getItem("SrcMakeForm.packageName1") || "";
  });  
  //javaパッケージ名(2階層目)
  const [packageName2, setPackageName2] = useState<string>(() => {
    // 初期値をローカルストレージから取得
    return localStorage.getItem("SrcMakeForm.packageName2") || "";
  });  
  //進捗管理用
  const [progress_status_id, setProgress_status_id] = useState(0);
  const [progress_status_progress1, setProgress_status_progress1] = useState(0);
  const [progress_status_progress2, setProgress_status_progress2] = useState(0);

  
  // プロジェクト名等の変更をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("SrcMakeForm.projectName", projectName);
    localStorage.setItem("SrcMakeForm.packageName1", packageName1);
    localStorage.setItem("SrcMakeForm.packageName2", packageName2);
  }, [projectName,packageName1,packageName2]);  

  // エラーコールバック関数
  function handleErrorExport() {
    //エクセルドラッグ画面を非表示
    //進捗状況の画面を非表示
    setProgress_status_id(0);
  }

  async function MakeSourceCode(e: FormEvent<HTMLFormElement>) {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();

    //APIに登録を発行
    if (selectedOptions && load_excel){

      // API(進捗管理用)
      setProgress_status_id(0);
      const progressStatusRequest = {
        processName: "MakeSourceCode"
      };
      const response1 = await callApi('progress_status_create', progressStatusRequest, 'application/json', false, handleErrorExport);
      let progress_status_id_tmp = 0;
      if (response1) {
        setProgress_status_id(response1.data.id);
        progress_status_id_tmp = response1.data.id;
      }else{
        return;
      }

      const formData = new FormData();
      formData.append('project_name', projectName);
      formData.append('packageName1', packageName1);
      formData.append('packageName2', packageName2);
      //エクセルをセット
      formData.append('tdd_excel',  load_excel);
      //シート名をセット
      const sheetNamesJson = JSON.stringify(selectedOptions);
      formData.append('sheet_names', sheetNamesJson);      
      //制御文字を残すか をセット
      formData.append('isTargetStrLeave', isTargetStrLeave.toString());  //true or false (小文字)
      //テスト系を生成するか をセット
      formData.append('isNonTestMake', isNonTestMake.toString());  //true or false (小文字)
      //進捗管理用
      formData.append('progress_status_id', progress_status_id_tmp.toString());

    
    
      //API発行
      const url =  'make_source_code';
      const response = await comUtil.callApi(url, formData,'multipart/form-data',true,handleErrorExport);
      if (response){
        //生成されたソースコードが圧縮ファイルとして届くのでダウンロード
        const blob = new Blob([response.data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = '生成資材.zip' as string;
        a.click();
        a.remove();
        URL.revokeObjectURL(url); 
      }
      //進捗画面を非表示
      setProgress_status_id(0);
    }
  }

  //ポーリングによる進捗状況表示
  useEffect(() => {
    // 進行状況の開始
    if (progress_status_id !== 0) {
      const fetchData = async () => { // 非同期関数を定義
        const data = { id: progress_status_id };
        const response = await callApi('progress_status_check', data, 'application/x-www-form-urlencoded',false,handleErrorExport);
        if (response) {
          setProgress_status_progress1(response.data.progress1);
          setProgress_status_progress2(response.data.progress2);
        }else{
          return;
        }
      };
      const interval = setInterval(() => {
        fetchData(); // fetchData関数を呼び出す
      }, 100); // 0.1秒ごとにポーリング

      return () => clearInterval(interval);
    }
  }, [progress_status_id]);  
  const setProgress_status_stop = async () => {
    // API(中止用)
    const data = { id: progress_status_id };
    const response = await callApi('progress_status_stop', data, 'application/x-www-form-urlencoded', false);
    if (response) {
    }
  }

  
  const handleExcelDrop = (blob: Blob) => {
    // アップロードされたファイルを処理する
    Load_tdd_excel(blob);
  };  

  //エクセル読込
  function Load_tdd_excel(excel: Blob): Promise<boolean> {
    //state初期化
    setSheetNames([]);
    setload_excel(excel);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try{
            if (e && e.target){
              var book = xlsx.read(e.target.result, {type: "array"});      
  
              //シート名を取得
              for (let i = 0; i <= book.SheetNames.length-1; i++) {
                const sheetName = book.SheetNames[i];
                //除外
                if (sheetName === "表紙") continue;
                if (sheetName === "改訂履歴") continue;
                if (sheetName === "一覧") continue;
                if (sheetName === "初期") continue;
                if (sheetName === "DBバージョン") continue;
                if (sheetName === "環境設定") continue;
                if (sheetName === "プログレス") continue;
                if (sheetName === "使い方") continue;

              //stateにシート名を追加
                setSheetNames(prevSheetNames => [...prevSheetNames, sheetName]);
              }
            }
        } catch (error: any) {
          Swal.fire({
            title: 'Error!',
            text: error.stack,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          resolve(true);
        }
  
      }
      reader.readAsArrayBuffer(excel);
    });
  };

  //チェックボックスのChangedイベント
  function IsTargetStrLeaveOnChanged(changeModel: {value: boolean;error: string;touched: boolean;field: string;}): void {
    setIsTargetStrLeave(changeModel.value);  
  }
  function isNonTestMakeOnChanged(changeModel: {value: boolean;error: string;touched: boolean;field: string;}): void {
    setIsNonTestMake(changeModel.value);  
  }

  //シート名を選択するチェックボックスのチェック状態を表示
  const handleOptionToggle = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // 全て選択するための関数
  const selectAll = () => {
    setSelectedOptions(SheetNames);
  };

  //シート名をチェックボックス付きで選択可能な形にして、縦に表示
  interface CheckListProps {
    options: string[];
    selectedOptions: string[];
    onOptionToggle: (option: string) => void;
  }
  const CheckList: React.FC<CheckListProps> = ({ options, selectedOptions, onOptionToggle }) => {
    return (
      <div>
      {options.map(option => (
        <div key={option}>
          <label>
            <input
              type="checkbox"
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => onOptionToggle(option)}
            />
            {option}
          </label>
        </div>
      ))}
    </div>
    );
  };          

  return (
    <Fragment>

      <div>
        <h1 className="h3 mb-2 text-gray-800">　</h1>
      </div>

      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <form onSubmit={MakeSourceCode} id="syori1_form">
            <div className="card-header py-3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h6 id="syori1_form_header" className="m-0 font-weight-bold text-green" style={{ alignSelf: 'flex-start' }}>
                  ソースコード生成 
                </h6>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={selectedOptions.length === 0}>
                    生成
                  </button>
                </div>
              </div>
            </div>

            {/* 画面の高さを調整し、スクロールバーを出して、生成ボタンを常時表示 */}
            <div className="card-body" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 230px)'}}>

              <div className="form-group">
                <label htmlFor="projectName">プロジェクト名</label>
                <input
                  type="text"
                  className="form-control"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectName">javaパッケージ名(1階層目)</label>
                <input
                  type="text"
                  className="form-control"
                  id="packageName1"
                  value={packageName1}
                  onChange={(e) => setPackageName1(e.target.value)}
                  required
                />
              </div>


              <div className="form-group">
                <label htmlFor="projectName">javaパッケージ名(2階層目)</label>
                <input
                  type="text"
                  className="form-control"
                  id="packageName2"
                  value={packageName2}
                  onChange={(e) => setPackageName2(e.target.value)}
                  required
                />
              </div>

              <ExcelDropzone
                label="テーブル定義書"
                id="table_definition_document"
                onDrop={handleExcelDrop}
              />

              <div>
                {SheetNames.length > 0 ? (
                  <div>
                    <h3 className={styles.blueText}>対象シート選択</h3>
                    <CheckList
                      options={SheetNames}
                      selectedOptions={selectedOptions}
                      onOptionToggle={handleOptionToggle}
                    />
                    <button type="button" onClick={selectAll} className={`btn btn-primary ${styles.buttonAllCheck}`}>
                      全て選択
                    </button>
                  </div>
                ) : (
                  <p className={styles.blueText}>テーブル定義書を読み込ませて下さい.</p>
                )}
              </div>

              <div>
                <Checkbox
                  id="isTargetStrLeave"
                  field="isTargetStrLeave"
                  value={isTargetStrLeave}
                  label="制御文字を残す"
                  onChange={IsTargetStrLeaveOnChanged}
                />

                <Checkbox
                  id="isNonTestMake"
                  field="isNonTestMake"
                  value={isNonTestMake}
                  label="処理シナリオ・テストデータを作成しない"
                  onChange={isNonTestMakeOnChanged}
                />
              </div>

            </div>
          </form>

          {/* 進捗管理用 */}
          {progress_status_id != 0 && <LoadingIndicator progress1={progress_status_progress1} progress2={progress_status_progress2} setProgress_status_stop={setProgress_status_stop}/>}

        </div>
      </div>
    </Fragment>
  );
};

export default Syori1Form;
