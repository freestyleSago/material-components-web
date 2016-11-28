/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import test from 'tape';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {captureHandlers} from '../helpers/foundation';

import MDLSelectFoundation from '../../../packages/mdl-select/foundation';

const {cssClasses} = MDLSelectFoundation;

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDLSelectFoundation);
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  td.when(mockAdapter.getTextForOptionAtIndex(td.matchers.isA(Number))).thenReturn('text');
  td.when(mockAdapter.create2dRenderingContext()).thenReturn({
    font: '',
    measureText: () => ({width: 100})
  });
  td.when(mockAdapter.getComputedStyleValue('font')).thenReturn('16px Times');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const menuHandlers = captureHandlers(mockAdapter, 'registerMenuInteractionHandler');
  foundation.init();

  return {foundation, mockAdapter, handlers, menuHandlers};
}

function createEvent(data) {
  return Object.assign({preventDefault: td.func('.preventDefault')}, data);
}

test('on click opens the menu', t => {
  const {mockAdapter, handlers} = setupTest();
  handlers.click(createEvent());
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN)), 'adds the open class');
  t.doesNotThrow(
    () => td.verify(mockAdapter.openMenu(0)), 'opens the menu'
  );
  t.end();
});

test('on click opens the menu focused at the selected index, if any', t => {
  const {foundation, mockAdapter, handlers} = setupTest();
  foundation.setSelectedIndex(1);
  handlers.click(createEvent());
  t.doesNotThrow(() => td.verify(mockAdapter.openMenu(1)));
  t.end();
});

test('on click cancels the event to prevent it from propagating', t => {
  const {handlers} = setupTest();
  const evt = createEvent();
  handlers.click(evt);
  t.doesNotThrow(() => td.verify(evt.preventDefault()));
  t.end();
});

test('on ArrowUp keydown on the select itself opens the menu', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({key: 'ArrowUp', eventPhase: Event.AT_TARGET});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN)), 'adds the open class');
  t.doesNotThrow(
    () => td.verify(mockAdapter.openMenu(0)), 'opens the menu'
  );
  t.doesNotThrow(() => td.verify(evt.preventDefault()), 'calls event.preventDefault()');
  t.end();
});

test('on ArrowUp keydown works with keyCode', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({keyCode: 38, eventPhase: Event.AT_TARGET});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN)));
  t.end();
});

test('on ArrowUp keydown does not open the menu on bubbled events', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({key: 'ArrowUp', eventPhase: Event.BUBBLING_PHASE});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 0}));
  t.end();
});

test('on ArrowDown keydown on the select itself opens the menu', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({key: 'ArrowDown', eventPhase: Event.AT_TARGET});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN)), 'adds the open class');
  t.doesNotThrow(
    () => td.verify(mockAdapter.openMenu(0)), 'opens the menu'
  );
  t.doesNotThrow(() => td.verify(evt.preventDefault()), 'calls event.preventDefault()');
  t.end();
});

test('on ArrowDown keydown works with keyCode', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({keyCode: 40, eventPhase: Event.AT_TARGET});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN)));
  t.end();
});

test('on ArrowDown keydown does not open the menu on bubbled events', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({key: 'ArrowDown', eventPhase: Event.BUBBLING_PHASE});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 0}));
  t.end();
});

test('on Space keydown prevents default to prevent page from scrolling', t => {
  const {handlers} = setupTest();
  const evt = createEvent({key: 'Space', eventPhase: Event.AT_TARGET});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(evt.preventDefault()));
  t.end();
});

test('on Space keydown works with keyCode', t => {
  const {handlers} = setupTest();
  const evt = createEvent({keyCode: 32, eventPhase: Event.AT_TARGET});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(evt.preventDefault()));
  t.end();
});

test('on Space keyup on the select itself opens the menu', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({key: 'Space', eventPhase: Event.AT_TARGET});
  handlers.keyup(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN)), 'adds the open class');
  t.doesNotThrow(
    () => td.verify(mockAdapter.openMenu(0)), 'opens the menu'
  );
  t.doesNotThrow(() => td.verify(evt.preventDefault()), 'calls event.preventDefault()');
  t.end();
});

test('on Space keyup works with keyCode', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({keyCode: 32, eventPhase: Event.AT_TARGET});
  handlers.keyup(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN)));
  t.end();
});

test('on Space keyup does not open the menu on bubbled events', t => {
  const {mockAdapter, handlers} = setupTest();
  const evt = createEvent({key: 'Space', eventPhase: Event.BUBBLING_PHASE});
  handlers.keydown(evt);
  t.doesNotThrow(() => td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 0}));
  t.end();
});

test('on MDLSimpleMenu:selected updates the selected index to that given by the event', t => {
  const {foundation, menuHandlers} = setupTest();
  const selected = menuHandlers['MDLSimpleMenu:selected'];
  selected(createEvent({detail: {index: 1}}));
  t.equal(foundation.getSelectedIndex(), 1);
  t.end();
});

test('on MDLSimpleMenu:selected fires a change event', t => {
  const {mockAdapter, menuHandlers} = setupTest();
  const selected = menuHandlers['MDLSimpleMenu:selected'];
  selected(createEvent({detail: {index: 1}}));
  t.doesNotThrow(() => td.verify(mockAdapter.notifyChange()));
  t.end();
});

test('on MDLSimpleMenu:selected does not fire change event if the index is already the selected index', t => {
  const {foundation, mockAdapter, menuHandlers} = setupTest();
  const selected = menuHandlers['MDLSimpleMenu:selected'];
  foundation.setSelectedIndex(1);
  selected({detail: {index: 1}});
  t.doesNotThrow(() => td.verify(mockAdapter.notifyChange(), {times: 0}));
  t.end();
});

test('on MDLSimpleMenu:selected closes the menu', t => {
  const {mockAdapter, menuHandlers} = setupTest();
  const selected = menuHandlers['MDLSimpleMenu:selected'];
  selected(createEvent({detail: {index: 1}}));
  t.doesNotThrow(() => td.verify(mockAdapter.removeClass(cssClasses.OPEN)));
  t.end();
});

test('on MDLSimpleMenu:selected refocuses on the select element', t => {
  const {mockAdapter, menuHandlers} = setupTest();
  const selected = menuHandlers['MDLSimpleMenu:selected'];
  selected(createEvent({detail: {index: 1}}));
  t.doesNotThrow(() => td.verify(mockAdapter.focus()));
  t.end();
});

test('on MDLSimpleMenu:cancel closes the menu', t => {
  const {mockAdapter, menuHandlers} = setupTest();
  const cancel = menuHandlers['MDLSimpleMenu:cancel'];
  cancel(createEvent());
  t.doesNotThrow(() => td.verify(mockAdapter.removeClass(cssClasses.OPEN)));
  t.end();
});

test('on MDLSimpleMenu:cancel re-focuses the select element', t => {
  const {mockAdapter, menuHandlers} = setupTest();
  const cancel = menuHandlers['MDLSimpleMenu:cancel'];
  cancel(createEvent());
  t.doesNotThrow(() => td.verify(mockAdapter.removeClass(cssClasses.OPEN)));
  t.end();
});