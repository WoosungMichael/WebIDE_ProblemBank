import React from 'react'
import './style.scss'
import Footer from '../../components/FooterMainPage'
import MainPageLayout from '../../../../layouts/ResultLayout'
//import wList from '../../../Problem/pages/DetailProblem'
var count = 1

function MainPage(props) {
    //console.log(location)
    return (
        <MainPageLayout>
            <div className="slide__container">
                <div className="modal">
                    <br></br>
                    <br></br>
                    <h1>&nbsp;&nbsp;&nbsp;&nbsp;코딩 테스트 결과</h1>
                    <div className="col">
                        <h3>총 응시자 수</h3>
                        <h2>{count++}</h2>
                    </div>
                    <div className="col">
                        <h3>시험 결과</h3>
                        <h2>0/5</h2>
                    </div>
                    <div className="col">
                        <h3>틀린 문제</h3>
                        <h2>{(window.location.search).substring(7,)}</h2>
                    </div>
                    <div className="col">
                        <a href="/totalproblems"><h3>시험문제 복습하기</h3></a>  
                    </div>
                    <div className="col">
                        <a href="/"><h3>메인으로 돌아가기</h3></a>        
                    </div>
                </div>
            </div>
        </MainPageLayout>
    )
}
export default MainPage

