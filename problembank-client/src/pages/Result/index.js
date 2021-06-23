import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Result1 from './pages/Result';


function Result(props) {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${match.url}`} component= {Result1}/>
        </Switch>
    )
}

export default Result
