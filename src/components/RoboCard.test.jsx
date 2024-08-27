import { render } from "@testing-library/react";
import { expect, test } from "vitest";

import RoboCard from "./RoboCard";


test('Renders a card when props passed', () => {
    const card = {
        id: 0,
        name: 'test name',
        email: 'test email',
        phone: 'test phone',
        image: 'test url',
    };

    const { container } = render(<RoboCard
        id={card.id}
        name={card.name}
        email={card.email}
        phone={card.phone}
        image={card.image}
    />);

  const div = container.querySelector('.card')
  expect(div).toHaveTextContent('test name');
});