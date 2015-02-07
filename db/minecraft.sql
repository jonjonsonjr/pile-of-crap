create table users (
  id serial primary key,
  username text unique,
  address text,
  capital_one text
);

create table games (
  id serial primary key,
  winning_address text,
  winner int references users(id)
);

create table addresses (
  id serial primary key,
  public text,
  private text,
  user_id int references users(id),
  game_id int references games(id)
);

create table games_users (
  id serial primary key,
  game_id int references games(id),
  user_id int references users(id)
);
