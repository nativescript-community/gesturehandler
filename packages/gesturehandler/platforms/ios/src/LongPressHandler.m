//
//  LongPressHandler.m
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "LongPressHandler.h"

#import <UIKit/UIGestureRecognizerSubclass.h>


@interface BetterLongPressGestureRecognizer : UILongPressGestureRecognizer

- (id)initWithGestureHandler:(GestureHandler*)gestureHandler;

@end

@implementation BetterLongPressGestureRecognizer {
  __weak GestureHandler *_gestureHandler;
}

- (id)initWithGestureHandler:(GestureHandler*)gestureHandler
{
  if ((self = [super initWithTarget:gestureHandler action:@selector(handleGesture:)])) {
    _gestureHandler = gestureHandler;
  }
  return self;
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesMoved:touches withEvent:event];
  if (_gestureHandler.shouldCancelWhenOutside && ![_gestureHandler containsPointInView]) {
    self.enabled = NO;
    self.enabled = YES;
  }
}

@end


@implementation LongPressGestureHandler

- (instancetype)initWithTag:(NSNumber *)tag
{
  if ((self = [super initWithTag:tag])) {
    _recognizer = [[BetterLongPressGestureRecognizer alloc] initWithGestureHandler:self];
    self.shouldCancelWhenOutside = YES;
  }
  return self;
}

- (void)configure:(NSDictionary *)config
{
  [super configure:config];
  UILongPressGestureRecognizer *recognizer = (UILongPressGestureRecognizer *)_recognizer;
  
  id prop = config[@"minDurationMs"];
  if (prop != nil) {
    recognizer.minimumPressDuration = [prop floatValue] / 1000.0;
  }
  
  prop = config[@"maxDist"];
  if (prop != nil) {
    recognizer.allowableMovement = [prop floatValue];
  }
}

//
- (void) setMinDurationMs:(CGFloat) value {
  ((UILongPressGestureRecognizer *)_recognizer).minimumPressDuration = value / 1000.0;
}
//
//- (NSNumber *) minDurationMs {
//  return [NSNumber numberWithFloat: ((UILongPressGestureRecognizer *)_recognizer).minimumPressDuration * 1000.0];
//}
//
- (void) setMaxDist:(CGFloat) value {
  ((UILongPressGestureRecognizer *)_recognizer).allowableMovement = value;
}
//
//- (NSNumber *) maxDist {
//  return [NSNumber numberWithFloat: ((UILongPressGestureRecognizer *)_recognizer).allowableMovement];
//}

- (GestureHandlerState)state
{
  // For long press recognizer we treat "Began" state as "active"
  // as it changes its state to "Began" as soon as the the minimum
  // hold duration timeout is reached, whereas state "Changed" is
  // only set after "Began" phase if there is some movement.
  if (_recognizer.state == UIGestureRecognizerStateBegan) {
    return GestureHandlerStateActive;
  }
  return [super state];
}
@end

