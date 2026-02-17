#Example 1: Checking a condition
num = 10
if num > 0:
  print("Number is positive")
elif num == 0:
  print("Zero")
else:
  print("Number is negative")

#Example 2: Nested condition
age = 11
if age >= 18:
  print("You can vote")
  if age >= 21:
    print("You can also drink alcohol")
  else:
    print("You can't drink alcohol")
else:
  print("You can't vote & Drink alcohol")

#Syntax for-loop
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
  print(fruit)

sequence = range(1, 10, 2)
print(sequence)

for num in sequence:
  print(num)

#syntax while loop
#while condition:
  # code to be executed
count = 5
while count > 0:
  print(count)
  count -= 1
print("Done")

for i in range(5):
  if i == 3:
    break # exit the loop
  print(i)
print("Done")

for i in range(5):
  if i == 3:
    continue  # skip the iteration
  print(i)
print("Done")

for i in range(10):
  if i % 3 == 0:
    continue  # skip the iteration
  print(i)
print("Done")

## Exercise:
num = int(input("Enter a number: 2"))

if num > 1:
  for i in range(2, int(num**0.5) + 1):
    if num % i == 0:
      print(f"{num} is not a prime number")
      break
  else:
    print(f"{num} is a prime number")
else:
  print(f"{num} is not a prime number")