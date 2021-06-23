import React, { useEffect, useRef, useState } from 'react'
import './style.scss'
import { ControlledEditor } from "@monaco-editor/react";
import SampleCode from '../../../../constansts/SampleCode';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string'
import { getProblemData } from '../../../../_actions/problemAction';
import projectsAPI from '../../../../apis/projects';
import problemsBank from '../../../../apis/problemsBank';
import WrapperLoading from '../../../../components/WrapperLoading';
import Loading from '../../../../components/Loading/Loading';
import DetailProblemLayout from '../../../../layouts/DetailProblemLayout';
var moment = require('moment');
var code = "";
var wList = [];

function DetailProblem(props) {
    const [problems, setProblems] = useState([])
    const [problem, setProblem] = useState({})
    const {problemsAllData} = useSelector(state => state.problem);

    const [language, setLanguage] = useState("c")
    const [contentEditor, setContentEditor] = useState(SampleCode["c"])
    const [submit, setSubmit] = useState(false)
    const [theme, setTheme] = useState("white")
    
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true)
    
    const { id } = queryString.parse(props.location.search);

    code = contentEditor;
    useEffect(() => {
        if(problemsAllData){
            const { data }  = problemsAllData;
            const [ problem ] = data.filter(element =>Number(element.id) === Number(id))
            setProblems(data)
            setLoading(false)
            setProblem(problem)
        }else{
            dispatch(getProblemData()).then(response => {
                const { data } = response.payload
                const [ problem ] = data.filter(element =>Number(element.id) === Number(id))
                
                console.log(problem)
                setProblem(problem)
                setProblems(data)
                setLoading(false)
            })
        }
    }, [id])

    const handleEditorChange = (env, value) => {
        setContentEditor(value)
    }
    
    var correctCnt = 0
    //submit content editor & problem
    const onSubmit = async () => {
        try {
            setSubmit(true);
                        
            //const problemId = queryString.parse(window.location.search).id;
            const problemId = problem.id;
            console.log(problemId)
            console.log(problem)

            // const IO_URL = process.env.REACT_APP_SERVER_API + "/projects";
    
            const params = {
                sourceCode: contentEditor,
                language,
                problemId: Number(problemId)
            }
    
            const response = await projectsAPI.compile(params); 
            
            const { data } = response;

            wList.push(data.wrongList);
            console.log(wList);
            
            var timeOutSubmit = function(){
                alert(`답안이 제출되었습니다. \n시험에 응시에 주셔서 감사합니다.`);
                setSubmit(false);
            };
            setTimeout(timeOutSubmit, 1000);
            
            /*
            var pageRedirect = function(){
                console.log(wList)
                props.history.push({
                    pathname: '/result/',
                    state: {wl: wList}
                })
            };
            */
           
            var pageRedirect = function(){
                props.history.push('/result?wList='+ wList); 
                wList = [];
            };
            
            
            setTimeout(pageRedirect, 1000);
            

        } catch (error) {
            setSubmit(false);
            alert("서버오류입니다. 잠시 후 다시 시도해주세요.");
            console.log(error)
        }

    }
    const handleProblemToList = async (id) => {
        try {
            const params = {
                problemId : id
            }
            const response = await problemsBank.ProblemToMyList(params);
            let problemTemp = {...problem, like : !problem.like};
            setProblem(problemTemp)
        } catch (error) {
            alert("서버 연결 실패합니다. 다시 시도해주세요.")
            console.log(error);
        }
    }
    const handleCopyURL = () => {
        var dummy = document.createElement('input'),
        text = window.location.href;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert("링크를 복사 되었습니다")
    }




    
    const nextQ = async() => {
        if (window.confirm("확인을 누르시면 현재 문제로는 다시 돌아올 수 없습니다.\n다음 문제로 이동하시겠습니까?")) {       
            
            setSubmit(true);
                        
            //const problemId = queryString.parse(window.location.search).id;
            const problemId = problem.id;
            console.log(problemId)
            console.log(problem)

            // const IO_URL = process.env.REACT_APP_SERVER_API + "/projects";
    
            const params = {
                sourceCode: contentEditor,
                language,
                problemId: Number(problemId)
            }
    
            const response = await projectsAPI.compile(params); 
            
            const { data } = response;

            wList.push(data.wrongList);
            correctCnt += data.correctCount

            setSubmit(false);
            
            props.history.push(`/problem/view?id=${problem.id + 1}`)
            setContentEditor(SampleCode[document.getElementById("lang").value])
        } else {
        }       
    }

    const [minutes, setMinutes] = useState(40);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const countdown = setInterval(() => {
        if (parseInt(seconds) > 0) {
            setSeconds(parseInt(seconds) - 1);
        }
        if (parseInt(seconds) === 0) {
            if (parseInt(minutes) === 0) {
                onSubmit();
                
                clearInterval(countdown);
            } else {
            setMinutes(parseInt(minutes) - 1);
            setSeconds(59);
            }
        }
        }, 1000);
        return () => clearInterval(countdown);
    }, [minutes, seconds])


 

















    if(loading){
        return <Loading  type={'bars'} color={'black'}  />
    }
    return (
        <DetailProblemLayout>
            <div className="problem__detail">
                <div className="problem__detail--content">
                    <div className="tab__header">
                        <ul className="tab__header--content">
                            <li style={{background: 'white'}} onClick={() => alert("현재 개발중인 기능 입니다...")}>설명</li>
                            {/* <li onClick={() => alert("현재 개발중인 기능 입니다...")}>답안</li>
                            <span>|</span> */}
                            <li onClick={() => alert("현재 개발중인 기능 입니다...")}>토론</li>
                            {/* <span>|</span>
                            <li onClick={() => alert("현재 개발중인 기능 입니다...")}>Submit</li> */}
                        </ul>
                    </div>
                    <div className="wrapper__content">
                        <h3>{problem.id}. {problem.name}</h3>
                        <ul className="tab__header--task">
                            <li style={{cursor: 'pointer'}} onClick={() => handleProblemToList(problem.id)}><i className="fa fa-list-alt"></i> { problem.like ? "Remove list" : "Add to list"}</li> 
                            <li style={{cursor: 'pointer'}} onClick={() => handleCopyURL()}><i className="fa fa-share-square-o"></i> Share</li>
                            <li>Created: {moment(problem.created).format("YYYY-MM-DD")}</li>
                            <li>Language: {problem.language}</li>
                        </ul>
                        <div className="problem__infor">
                            <div className="problem__infor--desc">
                                <p>문제 정의</p>
                                <span>{problem.content}</span>
                            </div>
                            <div className="problem__infor--input">
                                <p>입력</p>
                                <span>{problem.input}</span>
                            </div>
                            <div className="problem__infor--output">
                                <p>츨력</p>
                                <span>{problem.output}</span>
                            </div>
                            <div className="problem__infor--example">
                                <div className="problem__infor--inputexp">
                                    <p>입력 예제</p>
                                    {
                                        problem.testcases.length !== 0 &&
                                            problem.testcases.map(testcase => <span>{testcase.input_exp}</span>)
                                    }
                                </div>
                                <div className="problem__infor--outputexp">
                                    <p>출력 예제</p>
                                    {
                                        problem.testcases.length !== 0 &&
                                            problem.testcases.map(testcase => <span>{testcase.output_exp}</span>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab__footer">
                        <div>
                        <h2>Count Down</h2>
                        <div>
                            <h2>
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                            </h2>
                        </div>
                        </div>
                        <div className="pre-next-problem">
                            {
                                problems.length !== 0 ?
                                    <>
                                    <span><h2>{problem.id}/{problems.length - 1}</h2></span>&nbsp;
                                    </>
                                : ""   
                            }
                        </div>
                    </div>
                </div>
                <div className="problem__detail--vseditor">
                    <div className="tab__header--editor">
                        <ul>
                            <li>
                                <span>언어 </span>
                                <select name="" id="lang" className="language" value = {language} onChange={e => { setLanguage(e.target.value); setContentEditor(SampleCode[e.target.value])}}>
                                    <option value="c">C</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                    <option value="r">R</option>
                                </select>
                            </li>
                            <li>
                                <span>Editor Theme </span>
                                <select name="" id="" className="language" value={theme} onChange={(e) => setTheme(e.target.value)}>
                                    <option value="white">White</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </li>
                        </ul>
                    </div>
                    <div className="wrapper__editor">
                            {
                                submit ? 
                                <div className="wrapper__editor--submit">
                                    <WrapperLoading />
                                </div> : ""
                            }
                            <h2>{problem.id}번 문제</h2>
                            <ControlledEditor
                                width="100%"
                                height="97%"
                                theme={theme}
                                language={language}
                                value={contentEditor}
                                onChange={handleEditorChange}
                                loading={<WrapperLoading />}
                            /> 
                            
                        <div className="tab__footer">
                            <button onClick={() => nextQ()} disabled={problem.id === problems[problems.length-2].id}>Next Question</button>&nbsp;&nbsp;
                            <button onClick={() => onSubmit()} disabled={problem.id !== problems[problems.length-2].id}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </DetailProblemLayout>
    )
}


export default DetailProblem

