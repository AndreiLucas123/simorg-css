import { css } from 'simorg-css';

const div = css`
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #005bb5;
  }

  &:active {
    background: #004499;
  }
`;

const button = css`
  color: white;
  padding: 10px 20px;
  border: ${'none'};
  border-radius: 5px;
  cursor: pointer;
`;
