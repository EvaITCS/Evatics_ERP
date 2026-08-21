INSERT INTO application_stage_master (application_stage_name)
VALUES
    ('REGISTERED'),
    ('APPLICATION_STARTED'),
    ('DRAFT'),
    ('SUBMITTED'),
    ('UNDER_REVIEW'),
    ('RECHECK_REQUIRED'),
    ('ENROLLED'),
    ('ACTIVE'),
    ('COURSE_COMPLETED'),
    ('PLACED'),
    ('DROPPED');

INSERT INTO person_types(type_name)
VALUES
    ('EMPLOYEE'),
    ('STUDENT'),
    ('CANDIDATE');

INSERT INTO roles (role_id, role_name)
VALUES
    (1, 'ADMIN'),
    (2, 'LEAD'),
    (3, 'TRAINER'),
    (4, 'COUNSELLOR'),
    (5, 'STUDENT'),
    (6, 'HR'),
    (7, 'SALES'),
    (8, 'OPERATIONS'),
    (9, 'FINANCE'),
    (10, 'MANAGEMENT'),
    (11,'TEAMLEAD'),
    (12,'SUPERADMIN'),
    (13,'LABTRAINER'),
    (14,'TEAMSALES'),
    (15,'ACCOUNTS')
;


INSERT INTO action_types(action_name)
VALUES
    ('CALL'),
    ('EMAIL'),
    ('SMS');

INSERT INTO action_status_master(status_name)
VALUES
    ('CALL_PICKED'),
    ('NOT_REACHABLE'),
    ('CALL_BACK_LATER'),
    ('INTERESTED'),
    ('NOT_INTERESTED'),
    ('EMAIL_SENT'),
    ('EMAIL_OPENED'),
    ('SMS_SENT'),
    ('SMS_FAILED'),
    ('FOLLOWUP_REQUIRED');

INSERT INTO leave_types(
    leave_type_name,
    max_days_allowed,
    is_paid
)
VALUES
    ('CASUAL LEAVE',12,TRUE),
    ('SICK LEAVE',10,TRUE),
    ('EARNED LEAVE',15,TRUE),
    ('LOSS OF PAY',0,FALSE);

-- leave_status_master
INSERT INTO leave_status_master(status_name)
VALUES
    ('PENDING'),
    ('APPROVED'),
    ('REJECTED'),
    ('CANCELLED');

-- lead_sources
INSERT INTO lead_sources(source_name)
VALUES

    ('Monster'),
    ('Website'),
    ('Referral'),
    ('Walk-In'),
    ('LinkedIn'),

    ('Indeed'),
    ('Other');

-- lead_status_master
INSERT INTO lead_status_master(status_name)
VALUES
    ('NEW'),
    ('CONTACTED'),
    ('INTERESTED'),
    ('NOT_INTERESTED'),
    ('CALLBACK'),
    ('NO_RESPONSE'),
    ('INSERTED'),
    ('CONVERTED'),
    ('RE_ENGAGEMENT'),
    ('CLOSED'),
    ('APPLICATION_STARTED');





INSERT INTO departments (department_name, description)
VALUES
    ('Admissions', 'Student admission process'),
    ('Training', 'Student training and classes'),
    ('Human Resources', 'Employee management'),
    ('Sales', 'Sales and business development'),
    ('Operations', 'Daily operations management'),
    ('Finance', 'Accounts and finance'),
    ('Marketing', 'Marketing campaigns'),
    ('Information Technology', 'Technical support'),
    ('Student Support', 'Student assistance'),
    ('Management', 'Leadership and planning');


INSERT INTO student_drop_status_master
(status_name, description)
VALUES
    ('PENDING','Drop request submitted by trainer'),
    ('CONSULTANT_ASSIGNED','Consultant assigned by admin'),
    ('CONSULTANT_COMPLETED','Consultant submitted investigation'),
    ('APPROVED','Drop request approved'),
    ('REJECTED','Drop request rejected'),
    ('CANCELLED','Drop request cancelled');

INSERT INTO gender_master (gender_name)
VALUES
    ('Male'),
    ('Female'),
    ('Other'),
    ('Prefer Not To Say');

INSERT INTO address_type_master (address_type_name)
VALUES
    ('CURRENT'),
    ('PERMANENT'),
    ('EMERGENCY');

INSERT INTO contact_type_master (contact_type_name)
VALUES
    ('ALTERNATE_EMAIL'),
    ('ALTERNATE_PHONE'),
    ('EMERGENCY_PHONE');


INSERT INTO employee_status_master (employee_status_id, status_name)
VALUES
    (1, 'ACTIVE'),
    (2, 'ON_LEAVE'),
    (3, 'PROBATION'),
    (4, 'RESIGNED'),
    (5, 'TERMINATED');

INSERT INTO country_master
(country_code, country_name, phone_code)
VALUES

    ('AF','Afghanistan','+93'),
    ('AL','Albania','+355'),
    ('DZ','Algeria','+213'),
    ('AD','Andorra','+376'),
    ('AO','Angola','+244'),
    ('AR','Argentina','+54'),
    ('AM','Armenia','+374'),
    ('AU','Australia','+61'),
    ('AT','Austria','+43'),
    ('AZ','Azerbaijan','+994'),

    ('BS','Bahamas','+1'),
    ('BH','Bahrain','+973'),
    ('BD','Bangladesh','+880'),
    ('BB','Barbados','+1'),
    ('BY','Belarus','+375'),
    ('BE','Belgium','+32'),
    ('BZ','Belize','+501'),
    ('BJ','Benin','+229'),
    ('BT','Bhutan','+975'),
    ('BO','Bolivia','+591'),

    ('BA','Bosnia and Herzegovina','+387'),
    ('BW','Botswana','+267'),
    ('BR','Brazil','+55'),
    ('BN','Brunei','+673'),
    ('BG','Bulgaria','+359'),
    ('BF','Burkina Faso','+226'),
    ('BI','Burundi','+257'),

    ('KH','Cambodia','+855'),
    ('CM','Cameroon','+237'),
    ('CA','Canada','+1'),
    ('CV','Cape Verde','+238'),
    ('CF','Central African Republic','+236'),
    ('TD','Chad','+235'),
    ('CL','Chile','+56'),
    ('CN','China','+86'),
    ('CO','Colombia','+57'),
    ('KM','Comoros','+269'),
    ('CG','Congo','+242'),
    ('CR','Costa Rica','+506'),
    ('HR','Croatia','+385'),
    ('CU','Cuba','+53'),
    ('CY','Cyprus','+357'),
    ('CZ','Czech Republic','+420'),

    ('DK','Denmark','+45'),
    ('DJ','Djibouti','+253'),
    ('DO','Dominican Republic','+1'),

    ('EC','Ecuador','+593'),
    ('EG','Egypt','+20'),
    ('SV','El Salvador','+503'),
    ('EE','Estonia','+372'),
    ('ET','Ethiopia','+251'),

    ('FJ','Fiji','+679'),
    ('FI','Finland','+358'),
    ('FR','France','+33'),

    ('GA','Gabon','+241'),
    ('GM','Gambia','+220'),
    ('GE','Georgia','+995'),
    ('DE','Germany','+49'),
    ('GH','Ghana','+233'),
    ('GR','Greece','+30'),
    ('GT','Guatemala','+502'),
    ('GN','Guinea','+224'),

    ('HT','Haiti','+509'),
    ('HN','Honduras','+504'),
    ('HK','Hong Kong','+852'),
    ('HU','Hungary','+36'),

    ('IS','Iceland','+354'),
    ('IN','India','+91'),
    ('ID','Indonesia','+62'),
    ('IR','Iran','+98'),
    ('IQ','Iraq','+964'),
    ('IE','Ireland','+353'),
    ('IL','Israel','+972'),
    ('IT','Italy','+39'),

    ('JM','Jamaica','+1'),
    ('JP','Japan','+81'),
    ('JO','Jordan','+962'),

    ('KZ','Kazakhstan','+7'),
    ('KE','Kenya','+254'),
    ('KW','Kuwait','+965'),
    ('KG','Kyrgyzstan','+996'),

    ('LA','Laos','+856'),
    ('LV','Latvia','+371'),
    ('LB','Lebanon','+961'),
    ('LS','Lesotho','+266'),
    ('LR','Liberia','+231'),
    ('LY','Libya','+218'),
    ('LT','Lithuania','+370'),
    ('LU','Luxembourg','+352'),

    ('MG','Madagascar','+261'),
    ('MW','Malawi','+265'),
    ('MY','Malaysia','+60'),
    ('MV','Maldives','+960'),
    ('ML','Mali','+223'),
    ('MT','Malta','+356'),
    ('MR','Mauritania','+222'),
    ('MU','Mauritius','+230'),
    ('MX','Mexico','+52'),
    ('MD','Moldova','+373'),
    ('MN','Mongolia','+976'),
    ('ME','Montenegro','+382'),
    ('MA','Morocco','+212'),
    ('MZ','Mozambique','+258'),

    ('MM','Myanmar','+95'),

    ('NA','Namibia','+264'),
    ('NP','Nepal','+977'),
    ('NL','Netherlands','+31'),
    ('NZ','New Zealand','+64'),
    ('NI','Nicaragua','+505'),
    ('NE','Niger','+227'),
    ('NG','Nigeria','+234'),
    ('NO','Norway','+47'),

    ('OM','Oman','+968'),

    ('PK','Pakistan','+92'),
    ('PA','Panama','+507'),
    ('PG','Papua New Guinea','+675'),
    ('PY','Paraguay','+595'),
    ('PE','Peru','+51'),
    ('PH','Philippines','+63'),
    ('PL','Poland','+48'),
    ('PT','Portugal','+351'),

    ('QA','Qatar','+974'),

    ('RO','Romania','+40'),
    ('RU','Russia','+7'),
    ('RW','Rwanda','+250'),

    ('SA','Saudi Arabia','+966'),
    ('SN','Senegal','+221'),
    ('RS','Serbia','+381'),
    ('SC','Seychelles','+248'),
    ('SG','Singapore','+65'),
    ('SK','Slovakia','+421'),
    ('SI','Slovenia','+386'),
    ('SO','Somalia','+252'),
    ('ZA','South Africa','+27'),
    ('KR','South Korea','+82'),
    ('ES','Spain','+34'),
    ('LK','Sri Lanka','+94'),
    ('SD','Sudan','+249'),
    ('SE','Sweden','+46'),
    ('CH','Switzerland','+41'),

    ('TW','Taiwan','+886'),
    ('TJ','Tajikistan','+992'),
    ('TZ','Tanzania','+255'),
    ('TH','Thailand','+66'),
    ('TG','Togo','+228'),
    ('TN','Tunisia','+216'),
    ('TR','Turkey','+90'),
    ('TM','Turkmenistan','+993'),

    ('UG','Uganda','+256'),
    ('UA','Ukraine','+380'),
    ('AE','United Arab Emirates','+971'),
    ('GB','United Kingdom','+44'),
    ('US','United States','+1'),
    ('UY','Uruguay','+598'),
    ('UZ','Uzbekistan','+998'),

    ('VE','Venezuela','+58'),
    ('VN','Vietnam','+84'),

    ('YE','Yemen','+967'),

    ('ZM','Zambia','+260'),
    ('ZW','Zimbabwe','+263');



INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Afghan' FROM country_master WHERE country_code='AF';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Albanian' FROM country_master WHERE country_code='AL';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Algerian' FROM country_master WHERE country_code='DZ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Andorran' FROM country_master WHERE country_code='AD';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Angolan' FROM country_master WHERE country_code='AO';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Argentinian' FROM country_master WHERE country_code='AR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Armenian' FROM country_master WHERE country_code='AM';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Australian' FROM country_master WHERE country_code='AU';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Austrian' FROM country_master WHERE country_code='AT';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Azerbaijani' FROM country_master WHERE country_code='AZ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bahamian' FROM country_master WHERE country_code='BS';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bahraini' FROM country_master WHERE country_code='BH';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bangladeshi' FROM country_master WHERE country_code='BD';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Barbadian' FROM country_master WHERE country_code='BB';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Belarusian' FROM country_master WHERE country_code='BY';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Belgian' FROM country_master WHERE country_code='BE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Belizean' FROM country_master WHERE country_code='BZ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Beninese' FROM country_master WHERE country_code='BJ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bhutanese' FROM country_master WHERE country_code='BT';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bolivian' FROM country_master WHERE country_code='BO';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bosnian' FROM country_master WHERE country_code='BA';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Botswanan' FROM country_master WHERE country_code='BW';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Brazilian' FROM country_master WHERE country_code='BR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bruneian' FROM country_master WHERE country_code='BN';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Bulgarian' FROM country_master WHERE country_code='BG';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Cambodian' FROM country_master WHERE country_code='KH';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Cameroonian' FROM country_master WHERE country_code='CM';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Canadian' FROM country_master WHERE country_code='CA';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Chilean' FROM country_master WHERE country_code='CL';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Chinese' FROM country_master WHERE country_code='CN';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Colombian' FROM country_master WHERE country_code='CO';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Croatian' FROM country_master WHERE country_code='HR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Cuban' FROM country_master WHERE country_code='CU';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Czech' FROM country_master WHERE country_code='CZ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Danish' FROM country_master WHERE country_code='DK';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Egyptian' FROM country_master WHERE country_code='EG';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Finnish' FROM country_master WHERE country_code='FI';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'French' FROM country_master WHERE country_code='FR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'German' FROM country_master WHERE country_code='DE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Greek' FROM country_master WHERE country_code='GR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Hungarian' FROM country_master WHERE country_code='HU';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Icelandic' FROM country_master WHERE country_code='IS';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Indian' FROM country_master WHERE country_code='IN';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Indonesian' FROM country_master WHERE country_code='ID';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Iranian' FROM country_master WHERE country_code='IR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Iraqi' FROM country_master WHERE country_code='IQ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Irish' FROM country_master WHERE country_code='IE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Israeli' FROM country_master WHERE country_code='IL';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Italian' FROM country_master WHERE country_code='IT';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Japanese' FROM country_master WHERE country_code='JP';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Jordanian' FROM country_master WHERE country_code='JO';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Kenyan' FROM country_master WHERE country_code='KE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Kuwaiti' FROM country_master WHERE country_code='KW';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Malaysian' FROM country_master WHERE country_code='MY';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Mexican' FROM country_master WHERE country_code='MX';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Nepalese' FROM country_master WHERE country_code='NP';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'New Zealander' FROM country_master WHERE country_code='NZ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Nigerian' FROM country_master WHERE country_code='NG';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Norwegian' FROM country_master WHERE country_code='NO';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Pakistani' FROM country_master WHERE country_code='PK';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Philippine' FROM country_master WHERE country_code='PH';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Polish' FROM country_master WHERE country_code='PL';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Portuguese' FROM country_master WHERE country_code='PT';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Qatari' FROM country_master WHERE country_code='QA';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Romanian' FROM country_master WHERE country_code='RO';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Russian' FROM country_master WHERE country_code='RU';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Saudi Arabian' FROM country_master WHERE country_code='SA';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Singaporean' FROM country_master WHERE country_code='SG';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'South African' FROM country_master WHERE country_code='ZA';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'South Korean' FROM country_master WHERE country_code='KR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Spanish' FROM country_master WHERE country_code='ES';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Sri Lankan' FROM country_master WHERE country_code='LK';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Swedish' FROM country_master WHERE country_code='SE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Swiss' FROM country_master WHERE country_code='CH';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Taiwanese' FROM country_master WHERE country_code='TW';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Thai' FROM country_master WHERE country_code='TH';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Turkish' FROM country_master WHERE country_code='TR';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Ugandan' FROM country_master WHERE country_code='UG';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Ukrainian' FROM country_master WHERE country_code='UA';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Emirati' FROM country_master WHERE country_code='AE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'British' FROM country_master WHERE country_code='GB';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'American' FROM country_master WHERE country_code='US';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Uruguayan' FROM country_master WHERE country_code='UY';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Uzbek' FROM country_master WHERE country_code='UZ';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Venezuelan' FROM country_master WHERE country_code='VE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Vietnamese' FROM country_master WHERE country_code='VN';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Yemeni' FROM country_master WHERE country_code='YE';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Zambian' FROM country_master WHERE country_code='ZM';

INSERT INTO nationality_master (country_id, nationality_name)
SELECT country_id, 'Zimbabwean' FROM country_master WHERE country_code='ZW';




INSERT INTO designations (
    designation_name,
    designation_level,
    role_id
)
VALUES
    ('System Administrator', 'L1', 1),
    ('ERP Administrator', 'L2', 1),
    ('Office Administrator', 'L3', 1),
    ('Admin Team Lead', 'L4', 1),
    ('Administrative Manager', 'L5', 1),

    ('IELTS Trainer', 'L1', 3),
    ('PTE Trainer', 'L1', 3),
    ('Technical Trainer', 'L2', 3),
    ('Soft Skills Trainer', 'L2', 3),
    ('Senior Trainer', 'L3', 3),

    ('Counsellor', 'L1', 4),
    ('Senior Counsellor', 'L2', 4),
    ('Lead Counsellor', 'L3', 4),
    ('Counselling Manager', 'L4', 4);


INSERT INTO batch_status_master (batch_status_id, batch_status_name) VALUES
                                                                         (1, 'PLANNED'),
                                                                         (2, 'ONGOING'),
                                                                         (3, 'COMPLETED'),
                                                                         (4, 'CANCELLED');

INSERT INTO contact_type_master (contact_type_name)
VALUES
    ('PRIMARY_EMAIL'),
    ('PRIMARY_PHONE');