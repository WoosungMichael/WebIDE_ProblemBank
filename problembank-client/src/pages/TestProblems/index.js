import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import TestProblemsPage from './pages/TestProblemsPage';

function TestProblems(props) {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route exact path = {`${match.url}`} component = {TestProblemsPage} />        
        </Switch>
    )
}

export default TestProblems
