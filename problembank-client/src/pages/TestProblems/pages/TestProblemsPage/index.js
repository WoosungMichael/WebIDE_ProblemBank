import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './style.scss'
import { getProblemData } from '../../../../_actions/problemAction'
import { getTestData } from '../../../../_actions/problemAction'
import { useDispatch, useSelector } from 'react-redux';
import { FaBorderNone, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TestDisplayTable from '../../components/TestDisplayTable';
import Loading from '../../../../components/Loading/Loading';
import WrapperLoading from '../../../../components/WrapperLoading';
import TestProblemsLayout from '../../../../layouts/TestProblemsLayout';
import Select from 'react-select'

function TestProblemsPage(props) {

    const [problems, setProblems ] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [resultProblem, setResultProblem] = useState([]);

    const [countDisplayProblem, setCountDisplayProblem] = useState(15);
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false)

    React.useEffect(() => {
        dispatch(getProblemData()).then(response => {
            const { data } = response.payload;
            setProblems(data)
            const sliceProblems = data.slice(0, Number(countDisplayProblem))
            setResultProblem(sliceProblems)
        })
    }, [])

    const handleChange = (e) => {
        setLoading(true)
        let searchValue = e.target.value;
        const filterProblems = problems.filter(element => element.id === Number(searchValue) || element.name.match(new RegExp(searchValue, "i")))
        console.log(filterProblems)
        setKeyword(searchValue);    
        setResultProblem(filterProblems)

        setInterval(function(){ 
            setLoading(false)
        }, 500);
        
    }

    const handleChangeDisplayPro = (e) => {
        setLoading(true)
        const countValue = e.target.value;
        setCountDisplayProblem(countValue);

        const sliceProblems = problems.slice(0, Number(countValue))
        setResultProblem(sliceProblems);

        setInterval(function(){ 
            setLoading(false)
        }, 500);
    }
    const setDisplayListProblem = (e) =>{
        const temproblems = [...problems];
        if(e === "??????"){
            setResultProblem(temproblems)
            return;
        }
        const filterProblems = temproblems.filter(element => element.level === e);
        setResultProblem(filterProblems)
    }

    const blockSearch = keyword ? {display: "block"} : {display: "none"};
    const blockFotter = keyword && resultProblem.length === 0 ? {display: "none"} : {display: "block"};

    const [diffculty, setDiffculty ] = useState(false);

    return (
        <TestProblemsLayout>
            <div className="testproblems__page">
                <div className="container">
                    <div className="wrapper__search">
                        <div className="wrapper__search-key">
                            <input type="text" value={keyword} className="wrapper__search--text" onChange={handleChange} placeholder="??????, ????????? ???????????? ???????????????."/>
                            <p style = {blockSearch}>{keyword}
                            &nbsp;<span style={{cursor: "pointer"}} onClick={() => setKeyword("")}>x</span>
                            </p>
                        </div>
                        <div className="wrapper__search--filter">
                            <div className="filter-title diffculty__container" onClick={() => setDiffculty(!diffculty)}>
                                ????????? 
                                <i class="fa fa-caret-down"></i>
                                {
                                    diffculty ? 
                                        <div className="diffculty__container--select">
                                            <p onClick={() => setDisplayListProblem("???")}>???</p>
                                            <p onClick={() => setDisplayListProblem("???")}>???</p>
                                            <p onClick={() => setDisplayListProblem("???")}>???</p>
                                            <p onClick={() => setDisplayListProblem("??????")}>??????</p>
                                        </div> :
                                    ""
                                }
                            </div>
                            {/* <div className="filter-title" onClick={() => alert("?????? ?????? ?????? ???????????????.")}>
                                Status 
                                <i class="fa fa-caret-down"></i>
                            </div>
                            <div className="filter-title" onClick={() => alert("?????? ?????? ?????? ???????????????.")}>
                                List 
                                <i class="fa fa-caret-down"></i>
                            </div> */}
                            {/* <div className="filter-title" onClick={() => alert("?????? ?????? ?????? ???????????????.")}>
                                Tag 
                                <i class="fa fa-caret-down"></i>
                            </div> */}
                        </div>
                    </div>
                    <div className="wrapper__problems">
                        {
                            loading ? 
                            <WrapperLoading type={'bars'} color={'black'} />
                            :
                                keyword ? 
                                    resultProblem.length != 0 ?
                                        <TestDisplayTable problems = {resultProblem}/> 
                                    :
                                    <div style={{fontSize: '20px', textAlign: 'center', margin: '50px 0'}}>
                                        <p>?????? ?????? ????????????</p>
                                    </div>
                                        
                                :
                                    resultProblem.length != 0 ?
                                        <TestDisplayTable problems = {resultProblem} /> 

                                    :
                                        problems.length != 0 ?
                                            <TestDisplayTable problems = {problems} />  :
                                        <WrapperLoading type={"bars"} color={"black"} />

                        }
                        <div className="row-selector" style={blockFotter}>
                            <select class="form-control" onChange={handleChangeDisplayPro} value={countDisplayProblem}>
                                <option value="15">15</option>
                                <option value="30" selected="">30</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="sort-caret">
                                ?????????
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </TestProblemsLayout>
    )
}

export default TestProblemsPage

