import '../../enzymeSetup';

import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import ReportList from '../../../src/components/reportList';
import Report from '../../../src/components/reportList/report';

describe('ReportList', () => {
    let sequence = 0;
    const uniqID = () => {
        sequence++;
        return sequence;
    };

    const generateReports = (num) => Array(num).fill(0).map((_item) => ({
        id: uniqID()
    }));

    const getColors = (wrapper) => wrapper.find(Report)
        .map((reportEle) => reportEle.prop('color'));

    const expectNoAdjacentIdenticalColors = (colors) => {
        expect(colors.every((color, index) => {
            if (index === 0) { return true; }

            return color !== colors[index - 1];
        })).to.equal(true);
    };

    it('renders a list of reports', () => {
        const reports = generateReports(5);

        const wrapper = shallow(
            <ReportList isDesktop reports={reports} removeWeatherReport={sinon.stub} />
        );

        expect(wrapper.find(Report).length).to.equal(5);
    });

    it('renders each report with a different color than the last', () => {
        const reports = generateReports(1000);

        const wrapper = shallow(
            <ReportList isDesktop reports={reports} removeWeatherReport={sinon.stub} />
        );

        const colors = getColors(wrapper);

        expectNoAdjacentIdenticalColors(colors);
    });

    it('maintains previous generated colors for each report', () => {
        const reports = generateReports(10);

        const wrapper = shallow(
            <ReportList isDesktop reports={reports} removeWeatherReport={sinon.stub} />
        );

        const colors = getColors(wrapper);
        const additionalReport = generateReports(1);
        const newReports = [...additionalReport, ...reports]

        wrapper.setProps({
            reports: newReports
        });

        const newColors = getColors(wrapper);

        expectNoAdjacentIdenticalColors(newColors);
        expect(newColors.slice(1)).to.deep.equal(colors);
    });
});
