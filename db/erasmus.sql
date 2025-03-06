-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 08, 2025 at 02:06 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erasmus`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `choice_tasks`
--

CREATE TABLE `choice_tasks` (
  `id` int(11) NOT NULL,
  `game_id` int(11) DEFAULT NULL,
  `task_number` int(11) NOT NULL,
  `coord_x` decimal(10,6) NOT NULL,
  `coord_y` decimal(10,6) NOT NULL,
  `points` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `correct_option_index` int(11) NOT NULL,
  `hints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hints`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `choice_tasks` (`id`, `game_id`, `task_number`, `coord_x`, `coord_y`, `points`, `question`, `options`, `correct_option_index`, `hints`) VALUES
(1, 4, 5, 52.546007, 19.685939, 5, 'Co znajduje się na kopcu harcerza?', '[\"Krzyż walecznych\", \"Krzyż harcerski\", \"Krzyż Virtuti Militari\"]', 1, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `coord_x` decimal(10,6) NOT NULL,
  `coord_y` decimal(10,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `coord_x`, `coord_y`) VALUES
(1, 'Płock', 52.547056, 19.711214),
(2, 'Włocławek', 52.648480, 19.069693),
(3, 'Gąbin', 52.397302, 19.735961),
(4, 'Gostynin', 52.428788, 19.461926),
(5, 'Słupno', 52.505663, 19.836969),
(6, 'Bielsk', 52.671092, 19.799228);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `creation_date` date NOT NULL DEFAULT current_timestamp(),
  `coord_x` decimal(10,6) NOT NULL,
  `coord_y` decimal(10,6) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `author_id`, `title`, `creation_date`, `coord_x`, `coord_y`, `description`) VALUES
(1, 2, 'Sylwester u Zduniaka', '2024-12-31', 53.066486, 21.149823, 'Impreza sylwestrowa ze wstępem wolnym dla każdego w Przytułach'),
(2, 1, 'Rowerowe szaleństwo', '2025-01-13', 52.541332, 19.755332, 'Zapraszam wszystkich zainteresowanych do wspólnych szaleństw na Pump Tracku. Wszyscy mile widziani.'),
(3, 3, 'Wyjście z domu', '2025-01-16', 52.559106, 19.695203, 'Organizuję wyjście po zajęciach lekcyjnych na kebaba. Inicjatywa ma na celu integrację z innymi osobami zamiast przesiadywania w domu i grania na komputerze.'),
(4, 2, 'Sakralna Strona Miasta', '2025-02-14', 52.545007, 19.684939, 'Ta trasa poprowadzi Cię przez duchowe serce Płocka, odkrywając zarówno wielowiekowe świątynie, jak i miejsca pamięci związane z religijną historią miasta. Spacerując wśród zabytkowych budowli, poznasz losy społeczności, które na przestrzeni wieków kształtowały duchowy charakter Płocka. Wędrówka obejmie również punkty upamiętniające ważne postaci i wydarzenia, a także symboliczne miejsca, które do dziś przyciągają pielgrzymów i mieszkańców szukających chwili zadumy.'),
(5, 2, 'Płock uszyty sztuką', '2025-02-14', 52.545007, 19.684939, 'Miasto, w którym historia splata się ze sztuką, odkryje przed Tobą swoje najbardziej malownicze i inspirujące zakątki. Podczas tej gry terenowej odnajdziesz ślady znanych twórców, poznasz miejsca, które stały się tłem dla filmowych opowieści, oraz napotkasz oryginalne instalacje artystyczne. Spacerując wzdłuż malowniczych krajobrazów i uliczek, zobaczysz, jak różnorodne formy sztuki wpisują się w przestrzeń miejską, tworząc unikalną atmosferę.'),
(6, 2, 'Historyczne oblicze Płocka', '2025-02-14', 52.545007, 19.684939, 'Przenieś się w czasie i poznaj miejsca, które były świadkami kluczowych wydarzeń w dziejach miasta. Trasa poprowadzi Cię śladami dawnych fortyfikacji, miejsc pamięci oraz budowli, które przez wieki odgrywały istotną rolę w życiu mieszkańców. Spacerując ulicami Płocka, odkryjesz historie ludzi, którzy walczyli o wolność, tworzyli i bronili miasta, a także zobaczysz ślady dawnych epok, które do dziś kształtują jego niepowtarzalny charakter.');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `game_tags`
--

CREATE TABLE `game_tags` (
  `game_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_tags`
--

INSERT INTO `game_tags` (`game_id`, `tag_id`) VALUES
(1, 2),
(1, 4),
(1, 9),
(2, 1),
(2, 7),
(2, 8),
(3, 4),
(3, 7);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `login_details`
--

CREATE TABLE `login_details` (
  `id` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_details`
--

INSERT INTO `login_details` (`id`, `login`, `password`) VALUES
(1, 'wiktor', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6Indpa3RvciJ9.URzz158aZAyZv_ReAfAUxLhhFfWJgl7u03gldB40AQdbHwjdazMQC6XlpY7yjnc0OLSbspi9FEjLSGjE_nuWMkXIoGCnJrwDO110yjhtWuRFzGUW3ZCIULlLCRXymBEjwwDHjT07dz_lB9RedOdPnh7dq1hBsP3N0ugaSYRA5Z4'),
(2, 'filip', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6ImZpbGlwIn0.JpTlkX-eIGR5Qawg7_F2gx_4WyrqWkTDkeD3pbD6wWhlq17XSiqXI09GZMgINc-TYGZdJ28cWUMMYrmObV0eRlbhY6J4hgXm9zfI7iY240lKRQ6gNiNFeXEAzC0Dl97U_8DSF_3H192RAGJimIjfbfwBaY0hiCBt6Up3P6gACGU'),
(3, 'pawel', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6InBhd2VsIn0.AtkIkvVJWjFOScd2dcOy53MqU_hCaY6K5iWPcauACN20che83s2-7jF_20lOoH5ZjwXBdvov5MeLoOgqFd-wWGgVvPJATPOPits6XsRaN2ms6GdZ7Unbx1JV22Q_i7DgGBKCBUySJq6cPGhPkZ7DmYfCPHjhKTwSj4ecaEUiIYQ');


-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `number_tasks`
--

CREATE TABLE `number_tasks` (
  `id` int(11) NOT NULL,
  `game_id` int(11) DEFAULT NULL,
  `task_number` int(11) NOT NULL,
  `coord_x` decimal(10,6) NOT NULL,
  `coord_y` decimal(10,6) NOT NULL,
  `points` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` int(11) NOT NULL,
  `hints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hints`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `number_tasks` (`id`, `game_id`, `task_number`, `coord_x`, `coord_y`, `points`, `question`, `answer`, `hints`) VALUES
(3, 6, 1, 52.546007, 19.685939, 5, 'Ile lwów znajduje się przed ratuszem?', 2, NULL),
(4, 5, 2, 52.545007, 19.684939, 5, 'Ile postaci przedstawia mural nad murami?', 4, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'Sport'),
(2, 'Zabawa'),
(3, 'Zdrowie'),
(4, 'Ciekawe'),
(5, 'Dla młodszych'),
(6, 'Dla starszych'),
(7, 'Dla każdego'),
(8, 'Wyczynowe'),
(9, 'Nie zdrowe'),
(10, 'Edukacyjne');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `text_tasks`
--


CREATE TABLE `text_tasks` (
  `id` int(11) NOT NULL,
  `game_id` int(11) DEFAULT NULL,
  `task_number` int(11) NOT NULL,
  `coord_x` decimal(10,6) NOT NULL,
  `coord_y` decimal(10,6) NOT NULL,
  `points` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `hints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hints`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `text_tasks` (`id`, `game_id`, `task_number`, `coord_x`, `coord_y`, `points`, `question`, `answer`, `hints`) VALUES
(1, 4, 3, 52.545007, 19.684939, 5, 'Wpisz fragment tekstu na pomniku Broniewskiego', 'Z górskiej spoglądam na królewski las', NULL),
(2, 6, 4, 52.546007, 19.685939, 5, 'Podaj trzy istotne słowa związane z Placem Trzynastu Straconych', 'chleb, pokój, wolność', NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `expiration_time` datetime NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone_number`) VALUES
(1, 'Wiktor', 'Lutowski', 'lutowski.wiktor@szkola.elektrykplock.edu.pl', NULL),
(2, 'Filip', 'Bujalski', 'bujalski.filip@szkola.elektrykplock.edu.pl', '123456789'),
(3, 'Paweł', 'Krzeszewski', 'krzeszewski.pawel@szkola.elektrykplock.edu.pl', '101101101');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `choice_tasks`
--
ALTER TABLE `choice_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indeksy dla tabeli `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD KEY `games_ibfk_1` (`author_id`);

--
-- Indeksy dla tabeli `game_tags`
--
ALTER TABLE `game_tags`
  ADD PRIMARY KEY (`game_id`,`tag_id`),
  ADD KEY `game_tags_ibfk_2` (`tag_id`);

--
-- Indeksy dla tabeli `login_details`
--
ALTER TABLE `login_details`
  ADD KEY `login_details_ibfk_1` (`id`);

--
-- Indeksy dla tabeli `number_tasks`
--
ALTER TABLE `number_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indeksy dla tabeli `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `text_tasks`
--
ALTER TABLE `text_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indeksy dla tabeli `tokens`
--
ALTER TABLE `tokens`
  ADD KEY `tokens_ibfk_1` (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `choice_tasks`
--
ALTER TABLE `choice_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `number_tasks`
--
ALTER TABLE `number_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `text_tasks`
--
ALTER TABLE `text_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `choice_tasks`
--
ALTER TABLE `choice_tasks`
  ADD CONSTRAINT `choice_tasks_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `game_tags`
--
ALTER TABLE `game_tags`
  ADD CONSTRAINT `game_tags_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `game_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `login_details`
--
ALTER TABLE `login_details`
  ADD CONSTRAINT `login_details_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `number_tasks`
--
ALTER TABLE `number_tasks`
  ADD CONSTRAINT `number_tasks_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `text_tasks`
--
ALTER TABLE `text_tasks`
  ADD CONSTRAINT `text_tasks_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
