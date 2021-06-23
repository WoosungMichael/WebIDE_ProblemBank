import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getProblemsInformation } from '../../../../_actions/problemAction';
import './style.scss'

export default function FooterMainPage() {

    const [value, setValue] = useState({})
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProblemsInformation()).then(response => {
            const { data } = response.payload
            setValue(data)
        })
    }, [])

    return (
        <div className="footer__mainpage">
            <div className="wrapper">
                <div className="col">
                    <h2>동국대학교 컴퓨터공학과 PLASS 연구실</h2>
                    <h3>Dongguk University Plass Lab</h3>
                </div>
            </div>
        </div>
    )
}