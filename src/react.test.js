import React from 'react';
import App from './App';
import {configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});
test('Main component should contains Hello World !', () => {
    const app = shallow(<App />);
    const p = app.find('#HelloWorld');
    expect(p.text()).toBe('Hello World !');
});
