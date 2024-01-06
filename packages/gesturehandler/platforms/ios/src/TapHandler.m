//
//  TapHandler.m
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "TapHandler.h"

#import <UIKit/UIGestureRecognizerSubclass.h>


// BetterTapGestureRecognizer extends UIGestureRecognizer instead of UITapGestureRecognizer
// because the latter does not allow for parameters like maxDelay, maxDuration, minPointers, 
// maxDelta to be configured. Using our custom implementation of tap recognizer we are able
// to support these.

@interface BetterTapGestureRecognizer : UIGestureRecognizer

@property (nonatomic) NSUInteger numberOfTaps;
@property (nonatomic) NSTimeInterval maxDelay;
@property (nonatomic) NSTimeInterval maxDuration;
@property (nonatomic) CGFloat maxDistSq;
@property (nonatomic) CGFloat maxDeltaX;
@property (nonatomic) CGFloat maxDeltaY;
@property (nonatomic) NSInteger minPointers;

- (id)initWithGestureHandler:(GestureHandler*)gestureHandler;

@end

@implementation BetterTapGestureRecognizer {
  __weak TapGestureHandler *_gestureHandler;
  NSUInteger _tapsSoFar;
  CGPoint _initPosition;
  NSInteger _maxNumberOfTouches;
}

- (id)initWithGestureHandler:(GestureHandler*)gestureHandler
{
  if ((self = [super initWithTarget:gestureHandler action:@selector(handleGesture:)])) {
    _gestureHandler = (TapGestureHandler*)gestureHandler;
    _tapsSoFar = 0;
    _numberOfTaps = 1;
    _minPointers = 1;
    _maxDelay = 0.2;
    _maxDuration = NAN;
    _maxDeltaX = NAN;
    _maxDeltaY = NAN;
    _maxDistSq = NAN;
    _gestureHandler.shouldCancelWhenOutside = YES;
  }
  return self;
}

- (void)triggerAction
{
  [_gestureHandler handleGesture:self];
}

- (void)cancel
{
  self.enabled = NO;
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [_gestureHandler resetStored];
  [super touchesBegan:touches withEvent:event];
  if (_tapsSoFar == 0) {
    _initPosition = [self locationInView:self.view];
  }
  _tapsSoFar++;
  if (_tapsSoFar) {
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(cancel) object:nil];
  }
  NSInteger numberOfTouches = [touches count];
  if (numberOfTouches > _maxNumberOfTouches) {
    _maxNumberOfTouches = numberOfTouches;
  }
  if (!isnan(_maxDuration)) {
    [self performSelector:@selector(cancel) withObject:nil afterDelay:_maxDuration];
  }
  self.state = UIGestureRecognizerStatePossible;
  [self triggerAction];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesMoved:touches withEvent:event];
  NSInteger numberOfTouches = [touches count];
  if (numberOfTouches > _maxNumberOfTouches) {
    _maxNumberOfTouches = numberOfTouches;
  }
  
  if (self.state != UIGestureRecognizerStatePossible) {
    return;
  }
  
  if ([self shouldFailUnderCustomCriteria]) {
    self.state = UIGestureRecognizerStateFailed;
    [self triggerAction];
    [self reset];
    return;
  }
  
  self.state = UIGestureRecognizerStatePossible;
  [self triggerAction];
}

- (CGPoint)translationInView {
  CGPoint currentPosition = [self locationInView:self.view];
  return CGPointMake(currentPosition.x - _initPosition.x, currentPosition.y - _initPosition.y);
}

- (BOOL)shouldFailUnderCustomCriteria
{
  if (_gestureHandler.shouldCancelWhenOutside) {
    if (![_gestureHandler containsPointInView]) {
      return YES;
    }
  }
  
  CGPoint trans = [self translationInView];
  if (TEST_MAX_IF_NOT_NAN(fabs(trans.x), _maxDeltaX)) {
    return YES;
  }
  if (TEST_MAX_IF_NOT_NAN(fabs(trans.y), _maxDeltaY)) {
    return YES;
  }
  if (TEST_MAX_IF_NOT_NAN(fabs(trans.y * trans.y + trans.x + trans.x), _maxDistSq)) {
    return YES;
  }
  return NO;
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesEnded:touches withEvent:event];
  if (_numberOfTaps == _tapsSoFar && _maxNumberOfTouches >= _minPointers) {
    self.state = UIGestureRecognizerStateEnded;
    [self reset];
  } else {
    [self performSelector:@selector(cancel) withObject:nil afterDelay:_maxDelay];
  }
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesCancelled:touches withEvent:event];
  self.state = UIGestureRecognizerStateCancelled;
  [self reset];
}

- (void)reset
{
  if (self.state == UIGestureRecognizerStateFailed) {
    [self triggerAction];
  }
  [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(cancel) object:nil];
  _tapsSoFar = 0;
  _maxNumberOfTouches = 0;
  self.enabled = YES;
  [super reset];
}

@end

@implementation TapGestureHandler {
  __weak NSMutableDictionary *_lastExtraEventData;
}


- (instancetype)initWithTag:(NSNumber *)tag
{
  if ((self = [super initWithTag:tag])) {
    _recognizer = [[BetterTapGestureRecognizer alloc] initWithGestureHandler:self];
  }
  return self;
}

- (void)configure:(NSDictionary *)config
{
  [super configure:config];
  BetterTapGestureRecognizer *recognizer = (BetterTapGestureRecognizer *)_recognizer;
  
  APPLY_INT_PROP(numberOfTaps);
  APPLY_INT_PROP(minPointers);
  APPLY_FLOAT_PROP(maxDeltaX);
  APPLY_FLOAT_PROP(maxDeltaY);
  
  id prop = config[@"maxDelayMs"];
  if (prop != nil) {
    recognizer.maxDelay = [prop floatValue] / 1000.0;
  }
  
  prop = config[@"maxDurationMs"];
  if (prop != nil) {
    recognizer.maxDuration = [prop floatValue] / 1000.0;
  }
  
  prop = config[@"maxDist"];
  if (prop != nil) {
    CGFloat dist = [prop floatValue];
    recognizer.maxDistSq = dist * dist;
  }
}

- (void)resetStored
{
    _lastExtraEventData = NULL;
}
- (NSMutableDictionary *)eventExtraData:(UIGestureRecognizer *)recognizer
{
  if (recognizer.numberOfTouches == 0 && _lastExtraEventData != NULL) {
    return _lastExtraEventData;
  }
  NSMutableDictionary *result = [super eventExtraData:recognizer];
  if (recognizer.numberOfTouches != 0)
  {
    _lastExtraEventData = result;
  } 
  return result;
}


- (void)setMaxDist:(CGFloat)value {
  ((BetterTapGestureRecognizer*)_recognizer).maxDistSq = value * value;
}
- (void)setNumberOfTaps:(NSUInteger)value {
  ((BetterTapGestureRecognizer*)_recognizer).numberOfTaps = value;
}
- (void)setMaxDelayMs:(CGFloat)value {
  ((BetterTapGestureRecognizer*)_recognizer).maxDelay = value / 1000.0;
}
- (void)setMaxDurationMs:(CGFloat)value {
  ((BetterTapGestureRecognizer*)_recognizer).maxDuration = value / 1000.0;
}
- (void)setMaxDeltaX:(CGFloat)value {
  ((BetterTapGestureRecognizer*)_recognizer).maxDeltaX = value;
}
- (void)setMaxDeltaY:(CGFloat)value {
  ((BetterTapGestureRecognizer*)_recognizer).maxDeltaY = value;
}
- (void)setMinPointers:(NSInteger)value {
  ((BetterTapGestureRecognizer*)_recognizer).minPointers = value;
}
@end

