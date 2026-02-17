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