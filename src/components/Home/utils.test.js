/* eslint-disable no-undef */
import { createRoomID }  from './utils';

test('createRoomID equal', () => {
    expect(createRoomID('B76oSPMRzaN3H0RVYySiJWutyDi1', 'CQZNvxMCy9OH0lumm3gwHLFAOvt2')).toBe('B76oSPMRzaN3H0RVYySiJWutyDi1CQZNvxMCy9OH0lumm3gwHLFAOvt2');
});
test('createRoomID equal', () => {
    expect(createRoomID('9oxd5nnvw6XLa1NajWf7f68YXBu2', '9LyPD7tVNahJtfBIxfRsXNvDM183')).toBe('9LyPD7tVNahJtfBIxfRsXNvDM1839oxd5nnvw6XLa1NajWf7f68YXBu2');
});
test('createRoomID equal', () => {
    expect(createRoomID(null, '9LyPD7tVNahJtfBIxfRsXNvDM183')).toBe(false);
});
test('createRoomID equal', () => {
    expect(createRoomID('9oxd5nnvw6XLa1NajWf7f68YXBu2', 987654321)).toBe(false);
});