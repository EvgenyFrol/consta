import * as React from 'react';
import { act, fireEvent, render, RenderResult, screen } from '@testing-library/react';

import { cnSelect } from '../../SelectComponentsDeprecated/cnSelect';
import { cnSelectItem } from '../../SelectComponentsDeprecated/SelectItem/SelectItem';
import { BasicSelect, SimpleSelectProps } from '../BasicSelectDeprecated';

type SelectOption = {
  value: string;
  label: string;
};

const animationDuration = 200;
const testId = 'BasicSelect';

const items = [
  { label: 'Neptunium', value: 'Neptunium' },
  { label: 'Plutonium', value: 'Plutonium' },
  { label: 'Americium', value: 'Americium' },
  { label: 'Curium', value: 'Curium' },
  { label: 'Berkelium', value: 'Berkelium' },
];

const defaultProps = {
  id: 'sample',
  options: items,
  value: null,
  onChange: jest.fn(),
  getOptionLabel: (option: SelectOption): string => option.label,
  placeholder: 'placeholder',
  ariaLabel: 'test-select',
};

const renderComponent = (props: SimpleSelectProps<SelectOption> = defaultProps): RenderResult => {
  const { options, onChange, value, getOptionLabel, ...restProps } = props;
  return render(
    <>
      <div data-testid="outside" />
      <BasicSelect
        value={value}
        onChange={onChange}
        options={options}
        getOptionLabel={getOptionLabel}
        data-testid={testId}
        {...restProps}
      />
    </>,
  );
};

function getOptionsList() {
  return screen.getByRole('listbox');
}
function getRender() {
  return screen.getByTestId(testId);
}
function getIndicatorsDropdown() {
  return getRender().querySelector(`.${cnSelect('IndicatorsDropdown')}`) as HTMLElement;
}
function getOutside() {
  return screen.getByTestId('outside');
}
function indicatorsDropdownClick() {
  fireEvent.click(getIndicatorsDropdown());
}
function getInput() {
  return getRender().querySelector(`.${cnSelect('FakeField')}`) as HTMLElement;
}
function getOptions() {
  return getOptionsList().querySelectorAll(`.${cnSelectItem()}`);
}
function getOption(index = 1) {
  return getOptions()[index];
}
function inputClick() {
  fireEvent.click(getInput());
}
function outsideClick() {
  fireEvent.mouseDown(getOutside());
}
function animateDelay() {
  act(() => {
    jest.advanceTimersByTime(animationDuration);
  });
}

describe('?????????????????? BasicSelect', () => {
  it('???????????? ???????????????????? ?????? ????????????', () => {
    expect(renderComponent).not.toThrow();
  });

  it('???????????????????? ?? ?????????????????????????? ??????????????????', () => {
    const select = renderComponent({
      ...defaultProps,
      value: { label: '???????????????? ??????????', value: 'test' },
    });
    expect(select.getByText('???????????????? ??????????')).toBeInTheDocument();
  });

  it('?????????????????????? ?? ?????????????????????? ???? ??????????', () => {
    jest.useFakeTimers();
    act(() => {
      renderComponent();
    });

    inputClick();

    animateDelay();

    const optionsList = getOptionsList();

    expect(optionsList).toBeInTheDocument();
    inputClick();
    animateDelay();

    expect(optionsList).not.toBeInTheDocument();
  });

  it('?????????????????????? ?? ?????????????????????? ???? ?????????? ???? ?????????????????? ??????????????', () => {
    jest.useFakeTimers();
    act(() => {
      renderComponent();
    });

    inputClick();
    animateDelay();

    const optionsList = getOptionsList();

    expect(optionsList).toBeInTheDocument();
    outsideClick();
    animateDelay();
    expect(optionsList).not.toBeInTheDocument();
  });

  it('?????????????????????? ?? ?????????????????????? ???? ?????????? ???? ??????????????????', () => {
    jest.useFakeTimers();
    act(() => {
      renderComponent();
    });

    indicatorsDropdownClick();
    animateDelay();

    const optionsList = getOptionsList();

    expect(optionsList).toBeInTheDocument();
    indicatorsDropdownClick();
    animateDelay();
    expect(optionsList).not.toBeInTheDocument();
  });

  it('???????????????????????????? ??????????', () => {
    jest.useFakeTimers();
    act(() => {
      renderComponent();
    });

    inputClick();
    animateDelay();
    expect(getOptions().length).toEqual(items.length);
  });

  it('???????????????? onChange', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();
    const elementIndex = 1;
    act(() => {
      renderComponent({ ...defaultProps, onChange: handleChange });
    });

    inputClick();
    animateDelay();

    fireEvent.click(getOption(elementIndex));

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining(items[elementIndex]));
  });

  it('???????????????????? onFocus', () => {
    const handlerFocus = jest.fn();
    renderComponent({ ...defaultProps, onFocus: handlerFocus });

    expect(handlerFocus).toBeCalledTimes(0);

    getInput().focus();

    expect(handlerFocus).toBeCalledTimes(1);
  });

  it('???????????????????? onBlur', () => {
    const handlerBlur = jest.fn();
    renderComponent({ ...defaultProps, onBlur: handlerBlur });

    getInput().focus();

    expect(handlerBlur).toBeCalledTimes(0);

    getInput().blur();

    expect(handlerBlur).toBeCalledTimes(1);
  });
});
