import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import DetailTests from './pages/DetailTests';

function Tests(props) {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route exact path = {`${match.url}/view`} component = {DetailTests} />        
        </Switch>
    )
}

export default Tests

