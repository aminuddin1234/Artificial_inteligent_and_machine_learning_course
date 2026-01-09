-- stored procedures

select *
from employee_salary
where salary >= 50000
;

create procedure large_salaries()
select *
from employee_salary
where salary >= 50000
;

call large_salaries();

delimiter $$
create procedure large_salaries2()
begin
	select *
	from employee_salary
	where salary >= 50000;
	select *
	from employee_salary
	where salary >= 10000;
end $$
delimiter ;


delimiter $$
create procedure large_salaries4(hello int)
begin
	select salary
	from employee_salary
    where employee_id = hello
    ;
end $$
delimiter ;

call large_salaries4(1);