import { FlowContext } from '../Context.js';
import { useContext } from 'react';

var useModel = function () {
    return useContext(FlowContext);
};

export { useModel };
