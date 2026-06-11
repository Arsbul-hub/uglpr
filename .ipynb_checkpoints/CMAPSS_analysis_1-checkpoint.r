setwd("C:/Users/tuveg/Pictures/Maintenance models/Uglanov/CMAPSS Jet Engine Simulated Data")

# Data Set: FD001
# Train trajectories: 100
# Test trajectories: 100
# Conditions: ONE (Sea Level)
# Fault Modes: ONE (HPC Degradation)

# Data Set: FD002
# Train trajectories: 260
# Test trajectories: 259
# Conditions: SIX 
# Fault Modes: ONE (HPC Degradation)

# Data Set: FD003
# Train trajectories: 100
# Test trajectories: 100
# Conditions: ONE (Sea Level)
# Fault Modes: TWO (HPC Degradation, Fan Degradation)

# Data Set: FD004
# Train trajectories: 248
# Test trajectories: 249
# Conditions: SIX 
# Fault Modes: TWO (HPC Degradation, Fan Degradation)

# Data sets consists of multiple multivariate time series. 
# Each data set is further divided into training and test subsets. 
# Each time series is from a different engine – i.e., the data can be 
# considered to be from a fleet of engines of the same type. 

# Each engine starts with different degrees of initial wear and 
# manufacturing variation which is unknown to the user. 
# This wear and variation is considered normal, i.e., it is not considered 
# a fault condition. There are three operational settings that have a 
# substantial effect on engine performance. These settings are also 
# included in the data. The data is contaminated with sensor noise.

# The engine is operating normally at the start of each time series, 
# and develops a fault at some point during the series. 

# In the training set, the fault grows in magnitude until system failure. 
# In the test set, the time series ends some time prior to system failure. 
# The objective of the competition is to predict the number of remaining 
# operational cycles before failure in the test set, i.e., the number of 
# operational cycles after the last cycle that the engine will continue to 
# operate. Also provided a vector of true Remaining Useful Life (RUL) 
# values for the test data.

# The data are provided as a zip-compressed text file with 26 columns of 
# numbers, separated by spaces. Each row is a snapshot of data taken 
# during a single operational cycle, each column is a different variable. 

# The columns correspond to:
# 1)	unit number
# 2)	time, in cycles
# 3)	operational setting 1
# 4)	operational setting 2
# 5)	operational setting 3
# 6)	sensor measurement  1
# 7)	sensor measurement  2
# ...
# 26)	sensor measurement  26

# Loading in the training data. 

data1 <- read.table("train_FD001.txt", header = FALSE)
data2 <- read.table("train_FD002.txt", header = FALSE)
data3 <- read.table("train_FD003.txt", header = FALSE)
data4 <- read.table("train_FD004.txt", header = FALSE)

# Let's check on the survival times of all 100 engines first.

survival_times <- c()

for (k in 1:100) {
	survival_times <- c(survival_times, max(data1$V2[data1$V1==k]))
}

# Histogram of the values

hist(survival_times,breaks=20)

# Cumulative distribution of the values

plot(ecdf(survival_times))

# We try to linearize the data, assuming they are Weibull distributed
# Calculate ECDF (using Kaplan-Meier type or rank/n+1)

n <- length(survival_times)
F_i <- (1:n) / (n + 1) # Plotting positions

# Transform for Linearization

y <- log(-log(1 - F_i)) # Double log
x <- log(sort(survival_times))          # Log of data

plot(x, y, main = "Weibull Linearized Plot", xlab = "log(x)", ylab = "log(-log(1-F))")
fit <- lm(y ~ x)
abline(fit, col = "red")

# If we try to linearize the data, assuming they are normal distributed
# Extract ECDF values
f <- ecdf(survival_times)
x_sort <- sort(survival_times)
y_norm <- f(x_sort)

# Apply transformation (e.g., qnorm for normality)
plot(x_sort, qnorm(y_norm), main="Normal Linearized Plot")
fit <- lm(qnorm(head(y_norm,99)) ~ head(x_sort,99))
abline(fit, col = "red")

# If we try to linearize assuming lognormal distributions
# Extract ECDF values
f <- ecdf(log(survival_times))
x_log_sort <- log(sort(survival_times))
y_log_norm <- f(x_log_sort)

# Apply transformation (e.g., qnorm for normality)
plot(x_log_sort, qnorm(y_log_norm), main="Normal Linearized Plot")
fit <- lm(qnorm(head(y_log_norm,99)) ~ head(x_log_sort,99))
abline(fit, col = "red")

# Cullen and Frey plot

library(fitdistrplus)
descdist(survival_times, discrete=FALSE, boot=500)

# Fit a Gamma distribution

fit.gamma = fitdist(survival_times, "gamma")
plot(fit.gamma)

fit.weibull = fitdist(survival_times, "weibull")
plot(fit.weibull)

fit.beta = fitdist((survival_times-min(survival_times))/(max(survival_times)-min(survival_times)), "beta")
plot(fit.beta)

# Check of flight structure

plot(data2$V3[data2$V1==262],data2$V4[data2$V1==262],type='l')

# Let's check on the survival times of all 260 engines of the second data set.

survival_times_2 <- c()

for (k in 1:260) {
	survival_times_2 <- c(survival_times_2, max(data2$V2[data2$V1==k]))
}

plot(ecdf(survival_times_2))

n <- length(survival_times_2)
F_i <- (1:n) / (n + 1) # Plotting positions

# Transform for Linearization

y <- log(-log(1 - F_i)) # Double log
x <- log(sort(survival_times_2))          # Log of data

plot(x, y, main = "Weibull Linearized Plot", xlab = "log(x)", ylab = "log(-log(1-F))")
fit <- lm(y ~ x)
abline(fit, col = "red")

# Cullen and Frey plot

library(fitdistrplus)
descdist(survival_times_2, discrete=FALSE, boot=500)

# Fit a Gamma distribution

fit.lnorm=dist(survival_times_2, "lnorm")
plot(fit.lnorm)

fit.gamma = fitdist(survival_times_2, "gamma")
plot(fit.gamma)

fit.weibull = fitdist(survival_times_2, "weibull")
plot(fit.weibull)

fit.beta = fitdist((survival_times_2-min(survival_times_2))/(max(survival_times_2)-min(survival_times_2)), "beta")
plot(fit.beta)

